import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface CatBreed {
  num : number;
  id: number;
  breed: string;
  country: string;
  origin: string;
  coat: string;
  pattern: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  catBreeds: CatBreed[] = [];
  filteredCatBreeds: CatBreed[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 100;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getCatBreeds();
  }

  private getCatBreeds() {
    const limit = this.itemsPerPage * this.totalPages; // Fetch all data at once
    const page = 1;

    this.http.get<any>(`https://catfact.ninja/breeds?limit=${limit}&page=${page}`).subscribe(
      (response) => {
        if (response && Array.isArray(response.data)) {
          this.catBreeds = response.data.map((breed, index) => ({
            ...breed,
            num: (this.currentPage - 1) * this.itemsPerPage + index + 1, // Calculate the bil number
          }));
          this.totalPages = Math.ceil(response.total / this.itemsPerPage); // Calculate total pages based on total data and items per page
          this.getCurrentPageData(); // Call this after fetching data to initialize the list with the first page
        } else {
          console.error('Invalid cat breeds data:', response);
        }
      },
      (error) => {
        console.error('Error fetching cat breeds:', error);
      }
    );
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getCurrentPageData();
    }
  }

  getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Update filteredCatBreeds by slicing catBreeds array based on the current page
    this.filteredCatBreeds = this.catBreeds.slice(startIndex, endIndex);
  }

  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredCatBreeds = this.catBreeds.filter((breed) =>
      this.doesBreedContainSearchTerm(breed, searchTerm)
    );
  }

  doesBreedContainSearchTerm(breed: CatBreed, searchTerm: string): boolean {
    return JSON.stringify(breed).toLowerCase().includes(searchTerm);
  }
}
