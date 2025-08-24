from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime, timezone

app = FastAPI()

class Task(BaseModel):
    title: str
    description: str
    deadline: datetime
    importance: int
    status: str = Field(default="pending")

@app.post("/optimize")
def optimize(tasks: List[Task]):
    today = datetime.now(timezone.utc)

    def score(t: Task):
        t_deadline = t.deadline
        if t_deadline.tzinfo is None:
            t_deadline = t_deadline.replace(tzinfo=timezone.utc)
        days_left = max((t_deadline - today).days, 1)
        return t.importance / days_left

    optimized = sorted(tasks, key=score, reverse=True)
    return {"optimized": [task.dict() for task in optimized]}
