import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    public getAllTasks(): Task[] {
        return this.tasks;
    }

    public getTaskWithFilter(filterData: GetTasksFilterDto): Task[] {
        const { status, search } = filterData;
        let tasks = this.getAllTasks();
        if (status) {
            tasks = tasks.filter((task) => task.status === status);
        }
        if (search) {
            tasks = tasks.filter(
                (task) =>
                    task.title.includes(search) ||
                    task.description.includes(search),
            );
        }

        console.log({ filterData, tasks });

        return tasks;
    }

    public getTaskById(id: string): Task {
        // try to get task
        const task = this.tasks.find((task) => task.id === id);

        // if found return task
        if (task) {
            return task;
        }

        // otherwise throw new error 440

        throw new NotFoundException(`Task with ${id} not found`);
    }

    public deleteTaskById(id: string): boolean {
        const task = this.tasks.filter((task) => task.id !== id);
        if (task.length) {
            return true;
        }

        throw new NotFoundException();
    }

    public createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };
        this.tasks.push(task);

        return task;
    }

    public updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        if (task) {
            task.status = status;
        }

        return task;
    }
}
