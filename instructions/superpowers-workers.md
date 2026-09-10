# Superpowers Worker Routing For OpenCode

<SUBAGENT-STOP>
These instructions are for a primary agent coordinating Superpowers workflows.
If you were dispatched as a subagent, ignore this file and follow your dispatch
prompt.
</SUBAGENT-STOP>

The Superpowers templates use `Subagent (general-purpose)` plus a required
model. In OpenCode, route those dispatches through a model-specific worker by
setting `subagent_type` to one of these installed agents:

- `superpowers-worker-claude-opus-5`
- `superpowers-worker-claude-sonnet-5`
- `superpowers-worker-glm-5-2`
- `superpowers-worker-glm-5-3`
- `superpowers-worker-gpt-5-6-luna`
- `superpowers-worker-gpt-5-6-sol`
- `superpowers-worker-gpt-5-6-terra`
- `superpowers-worker-hy4-preview`
- `superpowers-worker-minimax-m3`
- `superpowers-worker-qwen-3-7-plus`
- `superpowers-worker-qwen-3-8-max`

## Role Selection

1. A worker named by the user is authoritative. The user may set separate
   workers for implementation, task review, re-review, and final review. Keep
   those role assignments for the full workflow unless the user changes them.
2. If the user names one worker without a role, use it for all Superpowers
   dispatches in that workflow.
3. If the user does not choose workers, select a specific worker for every
   dispatch using the active skill's model-selection guidance. Never fall back
   to the `general` subagent for a Superpowers implementation or review.
4. Use the implementation worker for implementers and fixers. Use the review
   worker for task reviews and scoped re-reviews. Use the final-review worker,
   when specified, for the whole-branch review.
5. On capability escalation, choose a more capable installed worker. Do not
   silently replace an explicit user-selected worker; report the need to
   escalate first unless the user already authorized automatic escalation.

The selected subagent definition pins its model, so do not try to pass a
`model` field to OpenCode's task tool. Fill the Superpowers prompt template as
written, then dispatch it with the selected worker name as `subagent_type`.
Resume the same worker with its `task_id` where the workflow requires rounds
1-3 to return to the original implementer.

Examples of user routing instructions:

- `Use superpowers-worker-gpt-5-6-sol for development and superpowers-worker-claude-opus-5 for review.`
- `Use superpowers-worker-glm-5-3 for implementation, superpowers-worker-gpt-5-6-terra for task review, and superpowers-worker-claude-opus-5 for final review.`
