import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class CustomNavbarNoBorder extends NavigationMixin(LightningElement) {
    menuItems = [
        { id: 1, label: 'Welcome Page', url: '/', isActive: false },
        { id: 2, label: 'Primary Investigator Information', url: 'primary-investigator-information', isActive: false },
        { id: 3, label: 'Contact Information', url: 'contact-information', isActive: false },
        { id: 4, label: 'Proposal Information', url: 'proposal-information', isActive: false },
        { id: 5, label: 'Study Design', url: 'study-design', isActive: false },
        { id: 6, label: 'Documentation', url: 'documentation', isActive: false },
        { id: 7, label: 'Privacy Notice', url: 'privacy-notice', isActive: false }
    ];

    connectedCallback() {
        this.setActiveMenuItem();
    }

    setActiveMenuItem() {
        const currentPath = window.location.pathname.toLowerCase();

        this.menuItems = this.menuItems.map(item => {
            if (item.url === '/') {
                // Exact match for Welcome Page (root path)
                return { ...item, isActive: currentPath === '/biogenesitedemo/' || currentPath === '/biogenesitedemo' };
            } else {
                // Includes logic for other items
                return { ...item, isActive: currentPath.includes(item.url.toLowerCase()) };
            }
        });
    }

    handleNavigation(event) {
        event.preventDefault();
        const path = event.target.dataset.url;

        const fullPath = path === '/'
            ? '/BioGeneSiteDemo/'
            : `/BioGeneSiteDemo/${path}`;

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: { url: fullPath }
        });
    }
}
