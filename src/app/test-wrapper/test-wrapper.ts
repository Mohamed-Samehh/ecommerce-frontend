import { Component } from '@angular/core';
import { SearchBar } from '../components/search-bar/search-bar';

@Component({
  selector: 'app-test-wrapper',
  imports: [SearchBar],
  templateUrl: './test-wrapper.html',
  styleUrl: './test-wrapper.css'
})
export class TestWrapper {

}
