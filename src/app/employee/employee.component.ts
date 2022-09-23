import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { ApiService } from '../shared/api.service';
import { EmployeeModel } from './employee-component.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  formValue !: FormGroup;
  updateForm !:FormGroup;
  employeeModelObj: EmployeeModel = new EmployeeModel();
  employeeData !: any;
  employeeName: any;
  email: any;
  salary:any;
  submitted: any = false;

  constructor(private formbuilder: FormBuilder,

    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      employeeName: ['', [Validators.required, Validators.maxLength(13), Validators.pattern("^[a-zA-Z]+$"),Validators.maxLength(15),Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      salary:['',[Validators.required,Validators.maxLength(10),
        Validators.pattern('^[0-9]+$')]]
    })
    this.updateForm = this.formbuilder.group({
      employeeName: ['',[Validators.required]],
      email: ['',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      salary:['',[Validators.required, Validators.pattern('^[0-9]+$')]]
    })

    this.fetchEmployeedata()
  }

//reload page

  reload() {
    this.formValue.reset()
    this.updateForm.reset()
    this.ngOnInit()
    this.submitted = false
  }

  postEmployeeData() {
    this.employeeModelObj.employeeName = this.formValue.value.employeeName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.salary=this.formValue.value.salary;

    if (this.formValue.invalid) {
      this.submitted = true
    }
    else {

      this.api.postEmployee(this.employeeModelObj).subscribe(res => {
        console.log(res);
        alert("Employee Added Successfully")
        this.reload() 
        this.fetchEmployeedata()
        // let ref = document.getElementById('remove')
        // ref?.click();
      },
        err => {
          alert("Something Went Wrong..")
          
        }
      )
    }
  }

  fetchEmployeedata() {
    this.api.fetchEmployee()
      .subscribe(res => {
        this.employeeData = res;
      })
  }

  removeEmployee(row: any) {
    this.api.deleteEmployee(row.id)
      .subscribe(res => {
        alert("Employee deleted Successfully")
        this.fetchEmployeedata()
      })
  }

  onEdit(row: any) {
    this.employeeModelObj.id = row.id;
    this.updateForm.controls['employeeName'].setValue(row.employeeName)
    this.updateForm.controls['email'].setValue(row.email)
    this.updateForm.controls['salary'].setValue(row.salary)
  }

  addData() {
    this.postEmployeeData();
    this.formValue.reset()
  }

  updateEmployee() {
    this.employeeModelObj.employeeName = this.updateForm.value.employeeName;
    this.employeeModelObj.email = this.updateForm.value.email;
    this.employeeModelObj.salary = this.updateForm.value.salary;


    if (this.updateForm.invalid) {
      this.submitted = true
      alert("Invalid form")
    }
    else {
      this.api.updateEmployee(this.employeeModelObj, this.employeeModelObj.id)
        .subscribe(res => {
          alert("Updated Successfully")
      
          this.fetchEmployeedata()
          // this.formValue.reset()
          let ref = document.getElementById('cancel')
          ref?.click();
        })
        this.reload()
    }
  }
}
