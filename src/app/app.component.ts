import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { EditComponent } from './edit/edit.component';
import { TaskService } from './services/task.service';
import { ITask } from './model/ITask';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  tasks: ITask[] = [];
  addTaskForm!: FormGroup;

  constructor(
    private taskService: TaskService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.fetchTasks();
    this.addTaskForm = this.fb.group({
      newTask: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  fetchTasks() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  addTask() {
    if (this.addTaskForm.valid) {
      const newTask = {
        text: this.addTaskForm.value.newTask,
        dateTime: this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
      };

      this.taskService.addTask(newTask).subscribe(
        (response) => {
          this.tasks.push(response);
          this.addTaskForm.reset();
        },
        (error) => {
          console.error('Erro ao criar a tarefa:', error);
        }
      );
    }
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(
      () => {
        this.fetchTasks();
      },
      (error) => {
        console.error('Erro ao excluir a tarefa:', error);
      }
    );
  }

  editTask(id: number): void {
    const taskToEdit: ITask | undefined = this.tasks.find(
      (task) => task.id === id
    );

    if (taskToEdit) {
      const ref = this.dialogService.open(EditComponent, {
        header: 'Editar tarefa',
        width: '30%',
        contentStyle: { 'max-height': '500px', overflow: 'auto' },
        data: { taskData: taskToEdit },
      });

      ref.onClose.subscribe(() => {
        console.log('Atualizando a lista de tarefas após a edição...');

        this.fetchTasks();
      });
    }
  }
}
