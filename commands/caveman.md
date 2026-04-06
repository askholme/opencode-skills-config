---
description: Activate caveman mode (lite/full/ultra) or stop it
---

Load the `caveman` skill using the skill tool.

$ARGUMENTS handling:
- If $ARGUMENTS is `stop` or `off`: deactivate caveman mode and revert to normal communication style.
- If $ARGUMENTS is `lite`, `full`, or `ultra`: activate caveman mode at that intensity level.
- If $ARGUMENTS is empty: activate caveman mode at the default `full` intensity level.

After loading the skill, apply the requested mode immediately for all subsequent responses in this session.
