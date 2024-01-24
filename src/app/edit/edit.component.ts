import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TaskService } from '../services/task.service';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: [],
})
export class EditComponent implements OnInit {
  @Output() taskEdited = new EventEmitter();

  editTaskForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.editTaskForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(4)]],
    });

    this.editTaskForm.patchValue({
      text: this.dialogConfig.data.taskData.text,
    });
  }

  handleEditTask() {
    const taskId: number = this.dialogConfig.data.taskData.id;

    const updatedTaskData = {
      text: this.editTaskForm.value.text,
      dateTime: this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
    };

    this.taskService.editTask(taskId, updatedTaskData).subscribe(
      () => {
        console.log('Tarefa editada com sucesso');

        this.taskEdited.emit();
        this.dialogRef.close();
      },
      (error) => {
        console.error('Erro ao editar a tarefa:', error);
      }
    );
  }
}
