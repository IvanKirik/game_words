import {BehaviorSubject} from "rxjs";
import {ACTIVE_TAB_TOKEN} from "../constants.ts";
import {StateService} from "./state.service.ts";

export class ActiveTabService {
    private readonly state: StateService;
    private readonly currentTabId: string;

    public updateToken$ = new BehaviorSubject<boolean>(false);

    constructor(state: StateService) {
        this.state = state;

        this.currentTabId = this.generateTabId();

        window.addEventListener('load', this.updateActiveTab.bind(this));
        window.addEventListener('focus', this.checkActiveTab.bind(this));
        window.addEventListener('storage', this.onStorageEvent.bind(this));

        this.updateActiveTab();
        this.checkActiveTab();
    }

    private generateTabId(): string {
        return Math.random().toString(36).substring(7);
    }

    private updateActiveTab(): void {
        localStorage.setItem(ACTIVE_TAB_TOKEN, this.currentTabId);
    }

    private checkActiveTab(): void {
        const activeTabId = localStorage.getItem(ACTIVE_TAB_TOKEN);

        if (activeTabId && this.currentTabId !== activeTabId) {
            this.showRefreshModal(activeTabId);
        }
    }

    private showRefreshModal(activeTabId: string): void {
        this.state.warning(true);
        this.updateToken$.subscribe((value) => {
            if (value) {
                localStorage.setItem(ACTIVE_TAB_TOKEN, activeTabId);
                location.reload();
            }
        });
    }

    private onStorageEvent(event: StorageEvent): void {
        if (event.key === ACTIVE_TAB_TOKEN) {
            this.checkActiveTab();
        }
    }
}
