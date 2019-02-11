import {Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {NavigationService} from '../../services/navigation.service';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Subscription} from 'rxjs';
import {NavigationItemModel} from '../../models/navigation-item.model';

const navigationBreakpoints = {
  large: 1400,
  medium: 960
};

const sideNavModes = {
  side: 'side',
  over: 'over'
};

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss']
})
export class SideNavigationComponent implements OnInit, OnChanges, OnDestroy {

  appName: string;
  brandLetter: string;
  menuItemSearchQuery: string;
  menuLinks: Array<NavigationItemModel>;
  visibleMenuLinks: Array<NavigationItemModel>;
  navLockedOpen: boolean;
  searchFocused: boolean;
  @Input() navClosed: boolean;
  @Input() navHovered: boolean;
  @Output() showNavLockAction: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() sideNavMode: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('navigationItemSearchInput') navigationItemSearchInput: ElementRef;
  _sideNavMode: string;

  private breakpointObserverSubscription: Subscription;
  private navigationServiceLockedOpenSubscription: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private navigationService: NavigationService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.appName = 'Spring Board';
    this.brandLetter = this.appName.slice(0, 1);

    iconRegistry.addSvgIcon(
      'drag',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/images/icons/drag.svg')
    );

    this.breakpointObserverSubscription = breakpointObserver.observe([
      `(min-width: ${navigationBreakpoints.medium}px)`
    ]).subscribe(result => {
      this.showNavLockAction.emit(result.matches);
      if (result.matches) {
        this._sideNavMode = sideNavModes.side;
      } else {
        this._sideNavMode = sideNavModes.over;
      }
      this.sideNavMode.emit(this._sideNavMode);
    });
  }

  ngOnInit() {
    this.menuLinks = this.navigationService.getMenuLinks();
    this.visibleMenuLinks = this.menuLinks;

    this.navLockedOpen = this.navigationService.isLocked();

    this.navigationServiceLockedOpenSubscription = this.navigationService.lockedOpen.subscribe(lockedOpen => {
      this.navLockedOpen = lockedOpen;
    });
  }

  drop(event: CdkDragDrop<object[]>) {
    moveItemInArray(this.menuLinks, event.previousIndex, event.currentIndex);
  }

  updateVisibleMenuItems(query) {
    let links: Array<NavigationItemModel>;
    if (query) {
      links = this.menuLinks.filter(link => {
        return link.title.toLowerCase().indexOf(query.toLowerCase()) > -1;
      });
    } else {
      links = this.menuLinks;
    }
    this.visibleMenuLinks = links;
  }

  toggleMenuLock() {
    this.navLockedOpen = this.navigationService.toggleLock();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.navClosed ||
      (this._sideNavMode !== sideNavModes.over && !this.navLockedOpen && changes.navHovered && !changes.navHovered.currentValue)) {
      this.resetNavigationSearchInput();
    }
  }

  ngOnDestroy(): void {
    this.breakpointObserverSubscription.unsubscribe();
    this.navigationServiceLockedOpenSubscription.unsubscribe();
  }

  private resetNavigationSearchInput() {
    this.menuItemSearchQuery = void(0);
    this.updateVisibleMenuItems(this.menuItemSearchQuery);
    this.navigationItemSearchInput.nativeElement.blur();
  }
}