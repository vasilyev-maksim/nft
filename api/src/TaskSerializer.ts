type Task = () => Promise<unknown>;

export class TaskSerializer {
  private queue: Task[] = [];
  private runningTasksCount = 0;

  public constructor(private readonly tasksInParallelMaxCount: number = 1) {}

  public planTask = (task: Task) => {
    this.queue.push(task);
    this.checkQueue();
  };

  private checkQueue() {
    if (this.queue.length > 0 && this.runningTasksCount < this.tasksInParallelMaxCount) {
      const task = this.queue.shift()!;
      this.runningTasksCount++;
      try {
        task().finally(() => {
          this.runningTasksCount--;
          this.checkQueue();
        });
      } catch (e) {
        this.runningTasksCount--;
      }
    }
  }
}
