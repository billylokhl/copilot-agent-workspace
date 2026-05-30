# Terminal Reliability

## Purpose
Guarantees autonomous command execution without hanging on interactive terminal prompts or hidden pagination screens.

## When to Use
Mandatory execution rules for every single terminal tool-call or shell environment interaction run by the agent.

## Procedure

1. Disable interactive CLI pagers globally before executing commands by appending appropriate environment variables or raw inline overrides (e.g., `git --no-pager`, or piping directly into `cat`).
2. Execute single, distinct tasks per terminal block. Never stitch commands onto the tail line of a heredoc block terminator.
3. Run an explicit, independent post-action validation command (such as `ls`, `grep`, or file checking) to confirm the success state of the file system rather than relying solely on default exit codes.

## Success Criteria
Commands execute to completion completely uninhibited, returning control to the shell loop with a cleanly logged exit code.
