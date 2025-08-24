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
    # Simple algorithm: sort by importance desc, then by deadline asc
    optimized = sorted(tasks, key=lambda t: (-t.importance, t.deadline))
    return {"optimized": optimized}
