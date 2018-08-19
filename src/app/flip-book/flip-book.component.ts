import { Component, OnInit, Renderer2, ElementRef, ViewChild, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { NodeComponent, CreateFlowService } from 'ng-textflow';

class BookDimensions {
  public pageY: number;

  constructor(
    public width: number,
    public height: number,
    public pageWidth: number,
    public pageHeight: number,
    public canvasPadding: number,
    
  ) {
    this.pageY = (height - pageHeight) / 2;
  }
}

class Page {
  constructor(
    public pageNumber: number,
    public progress: number,
    public target: number,
    public node: NodeComponent
  ) {}
}

@Component({
  selector: 'flip-book',
  template: `
    <canvas id="pageflip-canvas" #canvas width="500px" height="300px"></canvas>
    <div class="page">
      <ng-textflow
        [nodeStyles]="nodeStyles"
        [content]="textContent"
        [firstOnTop]="false"
        [isOverlaid]="true"
        [showPageNumbers]="true">
      </ng-textflow>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 500px;
      height: 300px;
      perspective: 1500px;
      background-image: url(./assets/img/book-background2.png);
      background-repeat: no-repeat;
      background-size: 505px 286px;
      background-position: -2px 9px;
    }

    .page {
      margin-left: 250px;
      margin-top: 20px;
      padding-top: 40px;
      padding-left: 20px;
    }

    .grab {
      cursor: grab;
    }

    .grabbing {
      cursor: grabbing;
    }

    #pageflip-canvas {
      background-color: transparent;
      z-index: 500;
      position: absolute;
      user-select: none;

    }
  `]
})
export class FlipBookComponent implements OnInit, OnDestroy {
  @ViewChild('canvas') canvasRef: ElementRef;
  @Input('content') textContent: string;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  xPos: number = 0;
  yPos: number = 0;
  bookDims: BookDimensions;
  pages: Page[]= [];
  private currentPageNumber: number = 1;
  nodesSubscription: Subscription;
  nodes: NodeComponent[];
  source: 'left' | 'right';
  private _selectedPage: Page;
  lastSelectedPage: Page;
  private requestAnimationId: number

  get selectedPage(): Page { return this._selectedPage; }
  set selectedPage(page: Page) {
    this.lastSelectedPage = this.selectedPage;
    this._selectedPage = page;
  }
  get page(): Page { return this.pages[this.currentPageNumber-1]; }
  get previousPage() { return this.currentPageNumber-1 >= 1 ? this.pages[this.currentPageNumber-2] : null }
  get nextPage(): Page { return this.currentPageNumber+1 <= this.pages.length+1 ? this.pages[this.currentPageNumber] : null; }
  get cursorSide(): 'left' | 'right' { return this.xPos < 0 ? 'left' : 'right' }

  private  nodeStyles = {
    hostStyle: {
      'background-image': 'url(./assets/img/page-background3.png)'
    },
    contentStyle: {
      'height':  '17em',
      'width':  '200px',
      'fontFamily':  '"Vollkorn", "serif"',
      'fontSize':  '11px',
      'wordSpacing':  '2px',
      'textAlign':  'justify',
      'color':  '#444',
      'lineHeight':  '1.1em',
      'leftAlignLast':  'justified'
    },
    headingStyle: {
      'fontFamily':  '"Vollkorn", "serif"',
      'padding-bottom':  '2px',
      'font-size':  '12px',
      'height':  '25px',
      'text-align': 'center'
    },
    numberStyle: {
      'font-size':  '8px',
      'fontFamily':  '"Vollkorn", "serif"'
    }
  };
  
  constructor( private renderer: Renderer2, private flowService: CreateFlowService) { }

  ngOnInit() {
    this.bookDims = new BookDimensions(500, 260, 240, 260, 20);
    this.canvas = this.canvasRef.nativeElement;
    this.context = this.canvas.getContext("2d");
    
    this.renderer.listen(this.canvas, 'mousemove', event =>  this.mouseMoveHandler(event));
    this.renderer.listen(this.canvas, 'mousedown', event =>  this.mouseDownHandler(event));
    this.renderer.listen(window, 'mouseup', event =>  this.mouseUpHandler(event));
    
    // Handle changes when the NodeComponent array is updated.
    this.nodesSubscription = this.flowService.nodes.subscribe(nodes => {
      if (nodes) {
        this.nodes = nodes;
        // Reset properties when content changes.
        this.pages = []; 
        this.currentPageNumber = 1;
        
        nodes.forEach((node, index) => {
          // Populate the pages.
          this.pages.push(new Page(index+1, 1, 1, node));
          // node.pageNumberAtTop = false;
        }); 
        nodes[0].heading = '1';
      }
      this.paint();
    });
  }


  paint() {
    this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    
    if (this.selectedPage) {
      this.selectedPage.target = Math.max( Math.min( this.xPos / this.bookDims.pageWidth, 1 ), -1 );
      this.selectedPage.progress += ( this.selectedPage.target - this.selectedPage.progress ) * 0.2;      
    }
    
    this.pages.forEach(page => {
      if (Math.abs(page.progress) < 0.997) {
        page.progress += ( page.target - page.progress ) * 0.1;
        this.drawPage(page);
      }
    });

    this.requestAnimationId = requestAnimationFrame(() => this.paint());
  }

  
  drawPage(page: Page) {
    let strength = 1 - Math.abs( page.progress );
    let verticalOutdent = 20 * strength;
    let foldWidth = ( this.bookDims.pageWidth * 0.5 ) * ( 1 - page.progress );
    let foldX = this.bookDims.pageWidth * page.progress + foldWidth;
    page.node.width = Math.max(foldX-20, 0);

    // The maximum width of the left and right side shadows
    let paperShadowWidth = ( this.bookDims.pageWidth * 0.5 ) * Math.max( Math.min( 1 - page.progress, 0.5 ), 0 );
    let rightShadowWidth = ( this.bookDims.pageWidth * 0.5 ) * Math.max( Math.min( strength, 0.5 ), 0 );
    let leftShadowWidth = ( this.bookDims.pageWidth * 0.5 ) * Math.max( Math.min( strength, 0.5 ), 0 );


    this.context.save();
    this.context.translate(this.bookDims.width / 2, this.bookDims.pageY + this.bookDims.canvasPadding);

    // Draw a sharp shadow on the left side of the page
    this.context.strokeStyle = 'rgba(0,0,0,'+(0.05 * strength)+')';
    this.context.lineWidth = 30 * strength;
    this.context.beginPath();
    this.context.moveTo(foldX - foldWidth, -verticalOutdent * 0.5);
    this.context.lineTo(foldX - foldWidth, this.bookDims.pageHeight + (verticalOutdent * 0.5));
    this.context.stroke();


    // Right side drop shadow
    let rightShadowGradient = this.context.createLinearGradient(foldX, 0, foldX + rightShadowWidth, 0);
    rightShadowGradient.addColorStop(0, 'rgba(0,0,0,'+(strength*0.2)+')');
    rightShadowGradient.addColorStop(0.8, 'rgba(0,0,0,0.0)');

    this.context.fillStyle = rightShadowGradient;
    this.context.beginPath();
    this.context.moveTo(foldX, 0);
    this.context.lineTo(foldX + rightShadowWidth, 0);
    this.context.lineTo(foldX + rightShadowWidth, this.bookDims.pageHeight);
    this.context.lineTo(foldX, this.bookDims.pageHeight);
    this.context.fill();


    // Left side drop shadow
    var leftShadowGradient = this.context.createLinearGradient(foldX - foldWidth - leftShadowWidth, 0, foldX - foldWidth, 0);
    leftShadowGradient.addColorStop(0, 'rgba(0,0,0,0.0)');
    leftShadowGradient.addColorStop(1, 'rgba(0,0,0,'+(strength*0.15)+')');

    this.context.fillStyle = leftShadowGradient;
    this.context.beginPath();
    this.context.moveTo(foldX - foldWidth - leftShadowWidth, 0);
    this.context.lineTo(foldX - foldWidth, 0);
    this.context.lineTo(foldX - foldWidth, this.bookDims.pageHeight);
    this.context.lineTo(foldX - foldWidth - leftShadowWidth, this.bookDims.pageHeight);
    this.context.fill();


    let foldGradient = this.context.createLinearGradient(foldX - paperShadowWidth, 0, foldX, 0);
    foldGradient.addColorStop(0.35, '#fafafa');
    foldGradient.addColorStop(0.73, '#eeeeee');
    foldGradient.addColorStop(0.9, '#fafafa');
    foldGradient.addColorStop(1.0, '#e2e2e2');
    this.context.fillStyle = foldGradient;
    this.context.strokeStyle = 'rgba(0, 0, 0, 0.06)';
    this.context.lineWidth = 0.5;
    this.context.beginPath();
    this.context.moveTo(foldX, 0);
    this.context.lineTo(foldX, this.bookDims.height);// - this.bookDims.canvasPadding);
    this.context.quadraticCurveTo(foldX, this.bookDims.height + (verticalOutdent * 2), foldX - foldWidth, this.bookDims.height + verticalOutdent);
    this.context.lineTo(foldX - foldWidth, -verticalOutdent);
    this.context.quadraticCurveTo(foldX, -verticalOutdent, foldX, 0);
    this.context.fill();
    this.context.stroke();
    this.context.restore();
  }


  turn(side: 'back' | 'forward') {
    if (side == 'back') {
      this.currentPageNumber--;
    } else {
      this.currentPageNumber++;
    }
  }


  mouseMoveHandler(event: MouseEvent) {
    this.xPos = event.offsetX - this.bookDims.width / 2;
    this.yPos = event.offsetY;
  }


  mouseDownHandler(event: MouseEvent) {
    if (this.cursorSide == 'left') {
      if (this.previousPage != null) {
        this.selectedPage = this.previousPage;
        this.source = 'left';
      }
    } else if (this.cursorSide == 'right') {
      if(this.nextPage != null) {
        this.selectedPage = this.page;
        this.source = 'right';
      }
    }
  }


  mouseUpHandler(event: MouseEvent) {
    if (this.selectedPage) {
      if(this.source != this.cursorSide) {
        if (this.cursorSide == 'right') {
          this.turn('back');
        } else {
          this.turn('forward');
        }
      }
      this.selectedPage = null;
      this.lastSelectedPage.target = this.cursorSide == 'left' ? -1 : 1;
    }
  }


  ngOnDestroy() {
    this.nodesSubscription.unsubscribe();
  }

}
