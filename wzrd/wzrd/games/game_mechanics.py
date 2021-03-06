import re
import random

POSSIBLE_DICE = (4, 6, 8, 10, 12, 20, 100)


def roll(meta: dict):
    result = {}
    total = 0

    for k, v in meta.items():
        match = re.match(r"d(\d+)", k)
        if not match:
            raise ValueError(f"Wrong dice format {k}!")

        num = int(match.group(1))
        if num not in POSSIBLE_DICE:
            raise ValueError(f"Wrong number of faces ({num})!")

        result[k] = [random.randint(1, num) for i in range(v)]
        total += sum(result[k])
    return total, result
