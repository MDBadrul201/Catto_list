import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  catBreeds: any[] = []; // Initialize as an empty array to avoid errors during rendering.

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getCatBreeds();
  }

  private getCatBreeds() {
    const limit = 10; // You can change this value to limit the number of results returned.

    this.http.get<any[]>('https://catfact.ninja/breeds?limit=' + limit).subscribe(
      (response) => {
        // Check if the response is an array before assigning it to catBreeds
        if (Array.isArray(response)) {
          this.catBreeds = response;
        } else {
          console.error('Invalid cat breeds data:', response);
        }
      },
      (error) => {
        console.error('Error fetching cat breeds:', error);
      }
    );
  }
}
