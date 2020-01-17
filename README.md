# mat-paginator-buttons
This directory will add pagination numbers in mat paginator

USe it like

    <mat-paginator
      appStylePaginator //<==== Call directive
      [currentPage]="currentPage" //<==== Required to tell directory regarding current page in parent component
      (page)="pageChangeEvent($event)"
      [length]="pageLength"
      [pageSize]="pageSize"
      showFirstLastButtons
    >
    </mat-paginator>
