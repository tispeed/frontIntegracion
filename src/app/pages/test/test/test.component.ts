import { Component, OnInit } from "@angular/core";
// import $ from 'jquery';

@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.scss"]
})
export class TestComponent implements OnInit {
	public data = [
	    {name: 'therichpost uno', email: 'therichpost@gmail.com', website:'therichpost.com'},
	    {name: 'therichpost dos', email: 'therichpost@gmail.com', website:'therichpost.com'},
	    {name: 'therichpost', email: 'therichpost@gmail.com', website:'therichpost.com'},
	    {name: 'therichpost', email: 'therichpost@gmail.com', website:'therichpost.com'},
	];
	  title = 'angulardatatables';
	  dtOptions: /*DataTables.Settings*/any = {};

  constructor() {}
  ngOnInit() {
  	 this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
  }
}
