import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITask } from '../model/ITask';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/tasks';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(this.apiUrl);
  }

  addTask(newTask: any): Observable<ITask> {
    return this.http.post<ITask>(this.apiUrl, newTask, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  editTask(taskId: number, updatedTaskData: any): Observable<void> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.put<void>(url, updatedTaskData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  deleteTask(taskId: number): Observable<void> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.delete<void>(url, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
}
