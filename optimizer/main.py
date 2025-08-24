from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import datetime

app = FastAPI()

class Task(BaseModel):
    title: str
    description: str
    deadline: datetime.datetime
    importance: int
    status: str

@app.post("/optimize")
def optimize(tasks: List[Task]):
    # Weighted priority: importance / days until deadline
    today = datetime.datetime.now()
    def score(t):
        days_left = max((t.deadline - today).days, 1)
        return t.importance / days_left

    optimized = sorted(tasks, key=lambda t: score(t), reverse=True)
    return {"optimized": optimized}
