import {
  AfterViewInit,
  Directive,
  DoCheck,
  Host,
  Input,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material';

@Directive({
  selector: '[appStylePaginator]',
})
export class StylePaginatorDirective implements AfterViewInit, DoCheck {
  @Input() public currentPage: any; // <<== for getting current page of component, specially after search
  public directiveLoaded = false;
  public pageGapTxt = '...';
  constructor(
    @Host() @Self() @Optional() private readonly matPag: MatPaginator,
    private readonly vr: ViewContainerRef,
    private readonly ren: Renderer2,
  ) {}

  private buildPageNumbers(pageCount, pageRange) {
    let dots = false;
    const paglast = pageCount;
    const pagcurrent = this.matPag.pageIndex;
    const showTotalPages = 8;
    for (let i = 0; i < paglast; i = i + 1) {
      if (
        i === pagcurrent ||
        (pagcurrent < showTotalPages && i < showTotalPages) ||
        (i > pagcurrent - (showTotalPages - 1) && i < pagcurrent) ||
        i > paglast - 1 ||
        (i > pagcurrent && i < pagcurrent + showTotalPages)
      ) {
        this.ren.insertBefore(pageRange, this.createPage(i, this.matPag.pageIndex), null);
      } else {
        if (i > pagcurrent && !dots) {
          this.ren.insertBefore(pageRange, this.createPage(this.pageGapTxt, this.matPag.pageIndex), null);
          dots = true;
        }
      }
    }
  }

  private createPage(i: any, pageIndex: number): any {
    const linkBtn = this.ren.createElement('mat-button');
    this.ren.addClass(linkBtn, 'mat-icon-button');

    const pagingTxt = isNaN(i) ? this.pageGapTxt : +(i + 1);
    const text = this.ren.createText(pagingTxt + '');
    this.ren.addClass(linkBtn, 'mat-custom-page');

    switch (i) {
      case pageIndex:
        this.ren.setAttribute(linkBtn, 'disabled', 'disabled');
        break;
      case this.pageGapTxt:
        this.ren.setAttribute(linkBtn, 'disabled', 'disabled');
        break;
      default:
        this.ren.listen(linkBtn, 'click', () => {
          this.currentPage = i;
          this.switchPage(i);
        });
        break;
    }

    this.ren.appendChild(linkBtn, text);
    return linkBtn;
  }

  private initPageRange(): void {
    const pagingContainerMain = this.vr.element.nativeElement.querySelector('.mat-paginator-range-actions');

    if (
      this.vr.element.nativeElement.querySelector('div.mat-paginator-range-actions div.btn_custom-paging-container')
    ) {
      this.ren.removeChild(
        pagingContainerMain,
        this.vr.element.nativeElement.querySelector('div.mat-paginator-range-actions div.btn_custom-paging-container'),
      );
    }

    const pagingContainerBtns = this.ren.createElement('div');
    const refNode = this.vr.element.nativeElement.childNodes[0].childNodes[0].childNodes[2].childNodes[5];
    this.ren.addClass(pagingContainerBtns, 'btn_custom-paging-container');
    this.ren.insertBefore(pagingContainerMain, pagingContainerBtns, refNode);

    const pageRange = this.vr.element.nativeElement.querySelector(
      'div.mat-paginator-range-actions div.btn_custom-paging-container',
    );
    pageRange.innerHtml = '';
    const pageCount = this.pageCount(this.matPag.length, this.matPag.pageSize);
    this.buildPageNumbers(pageCount, pageRange);
  }

  private pageCount(length: number, pageSize: number): number {
    return Math.floor(length / pageSize) + 1;
  }

  private switchPage(i: number): void {
    this.matPag.pageIndex = i;
    this.matPag._changePageSize(this.matPag.pageSize);
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      this.directiveLoaded = true;
    }, 500);
  }

  public ngDoCheck() {
    if (this.directiveLoaded) {
      const cPageNum = parseInt(this.currentPage, 10);
      this.matPag.pageIndex = cPageNum > 0 ? cPageNum - 1 : 0;
      this.initPageRange();
    }
  }
}
