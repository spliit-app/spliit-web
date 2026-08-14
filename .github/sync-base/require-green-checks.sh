#!/usr/bin/env bash
#
# Gate the base-release sync on upstream CI being green for the tagged commit.
#
#   require-green-checks.sh <owner/repo> <commit-sha>
#
# Exit codes:
#   0  green    - every required check succeeded and nothing else failed
#   2  red      - at least one check failed, or a required check was skipped
#   3  pending  - checks are still running, or a required check has not
#                 appeared yet; try again later
#
# Environment:
#   REQUIRED_CHECKS         comma-separated check-run names that must exist and
#                           succeed (default: "checks,e2e")
#   CHECKS_TIMEOUT_SECONDS  how long to wait for pending checks (default: 2700)
#   CHECKS_POLL_SECONDS     interval between polls (default: 60)
#   GH_TOKEN                token for `gh api`
#
# Note: the tagged commit is the ref that upstream's `push: tags` workflows run
# against, so cd.yml's build and e2e.yml's e2e both attach their check runs to
# it, as does ci.yml via the push to main. Use the check-runs API, not the
# legacy /status endpoint: GitHub Actions reports check runs, and /status
# returns `pending` with zero statuses for these commits.

set -euo pipefail

REPO="${1:?usage: require-green-checks.sh <owner/repo> <commit-sha>}"
SHA="${2:?usage: require-green-checks.sh <owner/repo> <commit-sha>}"

REQUIRED_CHECKS="${REQUIRED_CHECKS:-checks,e2e}"
CHECKS_TIMEOUT_SECONDS="${CHECKS_TIMEOUT_SECONDS:-2700}"
CHECKS_POLL_SECONDS="${CHECKS_POLL_SECONDS:-60}"

# Conclusions that are acceptable for a check we did not explicitly require.
# `skipped` and `neutral` are normal for conditional jobs; anything else that is
# completed and not `success` counts as a failure.
is_acceptable() {
  case "$1" in
    success | skipped | neutral) return 0 ;;
    *) return 1 ;;
  esac
}

deadline=$(( $(date +%s) + CHECKS_TIMEOUT_SECONDS ))

while :; do
  # filter=latest collapses re-runs to the most recent attempt per check name.
  runs="$(gh api --paginate \
    "repos/${REPO}/commits/${SHA}/check-runs?filter=latest&per_page=100" \
    --jq '.check_runs[] | [.name, .status, (.conclusion // "")] | @tsv')"

  # Plain strings rather than arrays: bash 3.2 errors on ${arr[@]} for an empty
  # array under `set -u`, and this script is also run by hand on macOS.
  failed=''
  running=''
  seen=0

  if [ -n "${runs}" ]; then
    while IFS=$'\t' read -r name status conclusion; do
      [ -n "${name}" ] || continue
      seen=$(( seen + 1 ))
      if [ "${status}" != 'completed' ]; then
        running="${running}${running:+, }${name} (${status})"
      elif ! is_acceptable "${conclusion}"; then
        failed="${failed}${failed:+, }${name} (${conclusion})"
      fi
    done <<< "${runs}"
  fi

  # A required check must exist, be completed, and have concluded `success` --
  # `skipped` is not good enough for something we explicitly demanded.
  # Split on commas via a here-string, not word splitting: check-run names
  # contain spaces (e.g. "build (linux/amd64, ubuntu-latest)").
  missing=''
  while IFS= read -r req; do
    req="$(printf '%s' "${req}" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
    [ -n "${req}" ] || continue
    found=''
    if [ -n "${runs}" ]; then
      while IFS=$'\t' read -r name status conclusion; do
        [ "${name}" = "${req}" ] || continue
        found='yes'
        # An outright failure was already recorded by the scan above; the case
        # only this loop can catch is a required check that was skipped or
        # neutral, which is acceptable for a check we did not demand.
        if [ "${status}" = 'completed' ] \
          && [ "${conclusion}" != 'success' ] \
          && is_acceptable "${conclusion}"; then
          failed="${failed}${failed:+, }${req} (required but ${conclusion})"
        fi
      done <<< "${runs}"
    fi
    [ -n "${found}" ] || missing="${missing}${missing:+, }${req}"
  done <<< "$(printf '%s' "${REQUIRED_CHECKS}" | tr ',' '\n')"

  echo "--- check runs on ${REPO}@${SHA:0:7} ---"
  if [ -n "${runs}" ]; then
    printf '%s\n' "${runs}" | awk -F'\t' '{printf "  %-40s %s %s\n", $1, $2, $3}'
  else
    echo "  (none)"
  fi

  if [ -n "${failed}" ]; then
    echo "RED: ${failed}"
    exit 2
  fi

  if [ -z "${running}" ] && [ -z "${missing}" ]; then
    echo "GREEN: ${seen} check run(s), required: ${REQUIRED_CHECKS}"
    exit 0
  fi

  reason=''
  [ -n "${running}" ] && reason="still running: ${running}"
  if [ -n "${missing}" ]; then
    [ -n "${reason}" ] && reason="${reason}; "
    reason="${reason}required check not reported yet: ${missing}"
  fi

  now="$(date +%s)"
  if [ "${now}" -ge "${deadline}" ]; then
    echo "PENDING (gave up after ${CHECKS_TIMEOUT_SECONDS}s): ${reason}"
    exit 3
  fi

  echo "waiting ${CHECKS_POLL_SECONDS}s - ${reason}"
  sleep "${CHECKS_POLL_SECONDS}"
done
