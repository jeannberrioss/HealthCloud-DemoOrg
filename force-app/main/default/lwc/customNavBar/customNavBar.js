import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class CustomNavbar extends NavigationMixin(LightningElement) {
    menuItems = [
        { id: 1, label: 'Welcome Page', url: '#' },
        { id: 2, label: 'Primary Investigator Information', url: 'primary-investigator-information' },
        { id: 3, label: 'Contact Information', url: 'contact-information' },
        { id: 4, label: 'Proposal Information', url: 'proposal-information' },
        { id: 5, label: 'Study Design', url: 'study-design' },
        { id: 6, label: 'Documentation', url: 'documentation' },
        { id: 7, label: 'Privacy Notice', url: 'privacy-notice' }
    ];

    handleNavigation(event) {
        event.preventDefault();
        const path = event.target.dataset.url;

        const fullPath = path.startsWith('#')
            ? path
            : `/BioGeneSiteDemo/${path}`;

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: fullPath
            }
        });
    }
}
