import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { EventSettingsModel, ScheduleComponent, View, DayService, WeekService, WorkWeekService, MonthService } from '@syncfusion/ej2-angular-schedule';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

import { ButtonComponent } from '@syncfusion/ej2-angular-buttons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(private http: HttpClient, public dialog: MatDialog){}



    //Sync Stuff


    @ViewChild('scheduleObj', { static: true })
    public scheduleObj?: ScheduleComponent;
    @ViewChild('addButtonObj', { static: true })
    public addButtonObj?: ButtonComponent;
    @ViewChild('editButtonObj', { static: true })
    public editButtonObj?: ButtonComponent;
    @ViewChild('deleteButtonObj', { static: true })
    public deleteButtonObj?: ButtonComponent;
  
    public data: object [] = [
  
    ];
  
    public selectedDate: Date = new Date();
    public eventSettings: EventSettingsModel = { dataSource: this.data };
    
  
    setView: View = 'Month';
    setDate: Date = new Date();
    hija_input: any;
    motivo_input: any;
    from_input: any;
    to_input: any;
    res_text: any = '';
    is_week_checked: boolean = false;
    is_month_checked: boolean = false;
    schedulerVis: boolean = false;
    calendarVis: boolean = true;
    camsOptions: { value: string, label: string }[] = [];
  
    eventObject: EventSettingsModel = {
      dataSource: [{
  
      }]
    }
  
    jsonDataFromApi:any;


    //Methods

  ngOnInit(): void {
    
  }

  fill_month(){

    console.log('Month: ' + this.is_month_checked)

    const currentDate = new Date();
    
    // Set the date to the first day of the next month and go back one day
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Get the day of the month, which gives you the number of days in the current month
    const numberOfDays = lastDayOfMonth.getDate();

    let Data: Object[] = [];
    
        //Gets the current day
          const today = new Date();
          const today_num = today.getDate();
          const days_left:any = [];

    //Adds the remaining days of the week to the list
    for (let i = today_num; i <= numberOfDays; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + (i - today_num));
      days_left.push(nextDay.toLocaleDateString('en-US', { weekday: 'long' }));
      

      Data.push({
        Id: 1,
        Subject: this.motivo_input,
        StartTime: nextDay,
        EndTime: nextDay,
        IsAllDay: false
      })
    };

  if (this.is_month_checked){

      
    //Adds the days left to the week on the calendar
    this.scheduleObj?.addEvent(Data);

  }
  else {

    this.scheduleObj?.deleteEvent(1);

  }

  }


  fill_week(): void {

    console.log(this.is_week_checked)

    let Data: Object[] = [{
      Id: 1,
      Subject: this.motivo_input,
      StartTime: new Date(),
      EndTime: new Date(),
      }];

      //Gets the current day
      const today = new Date();
      const today_num = today.getDay();
  
      // Calculate the remaining days of the week
      const days_left:any = [today.toLocaleDateString('en-US', { weekday: 'long' })];
    
      //Adds the remaining days of the week to the list
      for (let i = today_num + 1; i <= 6; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + (i - today_num));
        days_left.push(nextDay.toLocaleDateString('en-US', { weekday: 'long' }));
        

        Data.push({
          Id: 1,
          Subject: this.motivo_input,
          StartTime: nextDay,
          EndTime: nextDay,
          IsAllDay: false
        })
      };


    if (this.is_week_checked && this.scheduleObj){
      console.log('week is checked');
        
      //Adds the days left to the week on the calendar
      this.scheduleObj?.addEvent(Data);

    }
    else {

      this.scheduleObj?.deleteEvent(1);

    }

}


schedule_task(json_data:Object){

  const url = 'http://10.81.11.59:6060/api/schedule'

  this.http.post(url, json_data).subscribe( response => {

   // this.openDialog(response)


  })

}

submit_schedule(){

  let calendar_tasks = document.querySelectorAll('.e-appointment-wrapper > .e-appointment');

  let json_full: boolean = true;

  let tasks: any = [];

  calendar_tasks.forEach(task => {
    let task_name = task.textContent;
    let split_date = task.ariaLabel?.split(' at ')[0];
    let task_date = split_date?.split(',');

    if (task_date){
      
      tasks.push(task_date)

    }

  });

  let json_data: any = {
    'script': this.hija_input,
    'cams': this.motivo_input,
    'dates': tasks,
    'from': this.from_input,
    'to': this.to_input
  }
  
  for (const key in json_data) {
    if (json_data.hasOwnProperty(key)) {
      const value = json_data[key];

      if (value == undefined || value == ''){
        json_full = false;
        break;
      }
    }
  }

  console.log(json_data)

  if (json_full){
   
    console.log("Submit reached")

  }
  else{
    console.log("Missing info");
    //this.openDialog({'status': 'Error', 'message': 'Please fill all the missing data'})
  }


}

  showCalendar(){
    this.calendarVis = false;
    this.schedulerVis = true;


  }

  showScheduler(){
    this.calendarVis = true;
    this.schedulerVis = false;

    let schedulerFrag = document.querySelector('#calendarVis')

  }

}
