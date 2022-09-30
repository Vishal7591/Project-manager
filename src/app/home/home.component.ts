import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ColDef } from 'ag-grid-community';
import { QuoteService } from './quote.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  JSONData: any;

  columnDefs: ColDef[] = [{ field: 'project' }, { field: 'task' }, { field: 'subTask' }, { field: 'status' }];

  rowData: any = [];

  constructor(private quoteService: QuoteService) {}

  ngOnInit() {
    this.isLoading = true;
    this.JSONData = this.quoteService.getJSONFromLocalStorage();
    const projectsData: any[] = JSON.parse(this.JSONData).projects;
    console.log('Data from API Response', projectsData);

    for (let project = 0; project < projectsData.length && projectsData.length > 0; project++) {
      var projectsObj = {};

      projectsObj['project'] = projectsData[project].name;
      for (let task = 0; task < projectsData[project].tasks.length && projectsData[project].tasks.length > 0; task++) {
        projectsObj['task'] = projectsData[project].tasks[task].name;
        for (
          let subTask = 0;
          subTask < projectsData[project].tasks[task].children.length &&
          projectsData[project].tasks[task].children.length > 0;
          subTask++
        ) {
          projectsObj['subTask'] = projectsData[project].tasks[task].children[subTask].name;
          projectsObj['status'] = projectsData[project].tasks[task].children[subTask].status;

          this.rowData.push(projectsObj);
          projectsObj = {};
          console.log('projectsObj in innermost loop---->', projectsObj);
        }
        if (projectsData[project].tasks.length < 1) {
          this.rowData.push(projectsObj);
          projectsObj = {};
          console.log('projectsObj in tasks loop---->', projectsObj);
        }
      }

      if (projectsData.length < 1) {
        this.rowData.push(projectsObj);
      }
    }

    console.log('Row Data---->', this.rowData);

    this.quoteService
      .getRandomQuote({ category: 'dev' })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((quote: string) => {
        this.quote = quote;
      });
  }
}
