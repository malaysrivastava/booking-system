// booking.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../data.service';
import { SafeHtml,DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //by default seats set
  seats: {seatNumber:number;booked:boolean|null}[] = Array.from({ length: 80 }, (_, i) => {return {seatNumber:i + 1,booked:null}});
  //variable to show booking response
  responseMessage: SafeHtml | null = null;
  //selected coach
  selectedCoach: string = '';
  //total number of seats
  numberOfSeats: string = '';

  constructor(private dataService: DataService,private sanitizer: DomSanitizer) {
      
  }
  //Array to store list of trains
  trainOptions = [
    { id: 0, name: 'Select Train',trainNumber:null }
  ];
  
  //Array to display options in coach dropdown menu
  coachOptionList: {id:number,seq:number}[] = [];
  // Array to store list of all coached of respected train
  coachOptions: { [key: string]: {id:number,seq:number}[] } = {};

  //function is triggered, whenever page is rendered
  ngOnInit() {
    this.dataService.getData('train/getDetails').subscribe(
      (response) => {
        this.trainOptions = [...this.trainOptions,...response.data]
        response.data && response.data.map((data:any)=>{
           if(data.coaches.length){
            this.coachOptions[data.id] = data.coaches.map((coach:any,key:number)=>{return {id:coach.id,seq:key+1}});
           }
        })
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  //set seats in layout
  private fetchSeats(coachId?:string){
    //check if coachID exist
    if(!coachId || Number(coachId) == 0){
      this.seats = Array.from({ length: 80 }, (_, i) => {return {seatNumber:i + 1,booked:null}});
      return;
    }
    //get all seats of respected coach
    this.dataService.getData(`seat/getDetails?coachId=${coachId}`).subscribe(
      (response) => {
        this.seats = response.data.map((seat:any)=>{
            return {seatNumber:seat.seatNumber,booked:seat.isBooked}
        })
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }
  // select train
  onTrainChange(event: Event) {
    this.responseMessage = ''
    const target = event.target as HTMLSelectElement;
    this.coachOptionList = this.coachOptions[target.value] || [];
    this.selectedCoach = this.coachOptionList[0]?.id.toString();
    this.fetchSeats(this.selectedCoach);
    this.numberOfSeats = ''
  }
  //select coach
  onCoachChange(event: Event) {
    this.responseMessage = ''
    this.selectedCoach = (event.target as HTMLSelectElement).value;
    this.fetchSeats(this.selectedCoach);
  }

  //select coach
  onSeatsChange(event: Event) {
    this.responseMessage = ''
    this.numberOfSeats = (event.target as HTMLInputElement).value;
  }


  //to book seats
  onSubmit(event: Event) {
    event.preventDefault(); // Prevent the page from refreshing
    if(this.selectedCoach && this.numberOfSeats){
      this.dataService.postData('seat/bookSeats',{seats:this.numberOfSeats,coachId:this.selectedCoach}).subscribe(
        (response) => {
          const seatList = response.data.map((seat: string) => `Seat - ${seat}`).join('<br>');
          const message = `<h2>Booked seats</h2>${seatList}`;
          this.responseMessage = this.sanitizer.bypassSecurityTrustHtml(message);
          this.fetchSeats(this.selectedCoach);
        },
        (error) => {
          this.responseMessage = this.sanitizer.bypassSecurityTrustHtml(`<h3>${error.error}</h3>`);
        }
      );
    }
  }


  getGreeting(): string {
    return 'Welcome to Ticket booking platform';
  }

  getNumberColor(booked: boolean | null): string {
    if (booked) {
      return '#EF4444'; // booked
    } else if(booked === false) {
      return '#22C55E'; // vacant
    } else{
      return 'grey';
    }
  }
}
