import Index from '../pages/Index';
import Account from '../pages/Account';
import PopupSignTransaction from '../pages/Popups/SignTx';
import PopupConnect from '../pages/Popups/Connect';
import Settings from '../pages/Settings';
import GeneralSettings from '../pages/GeneralSettings';
import SecuritySettings from '../pages/SecuritySettings';
import BackupWallet from '../pages/BackupWallet';
import RestoreWallet from '../pages/RestoreWallet';
import AboutSettings from '../pages/AboutSettings';
import TermsOfService from '../pages/TermsOfService';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import ImportAccount from '../pages/ImportAccount';
import Intro from '../pages/Intro';
import Networks from '../pages/Networks';
import NotFound from '../pages/NotFound';
import Address from '../pages/Address';
import SignMessage from '../pages/SignMessage';
import webIframePopups from './web-iframe-popups';

// Hypersign related
import Credentials from '../pages/Credentials';
import Profile from '../pages/Profile';
import CredentialsDetails from '../pages/CredentialsDetails';
import CredentialsDetailsTemp from '../pages/CredentialsDetailsTemp';
import CredentialsDetailsAuthorize from '../pages/CredentialsDetailsAuthorize';
import Deeplink  from '../pages/Deeplink';

export default [{
        path: '/',
        component: Index,
        meta: {
            title: '',
            navigation: false,
            ifNotAuthOnly: true,
            notPersist: true,
        },
    },
    {
        path: '/account',
        name: 'account',
        component: Account,
    },
    {
        name: 'popup-sign-tx',
        path: '/popup-sign-tx',
        component: PopupSignTransaction,
        props: true,
        meta: {
            notPersist: true,
        },
    },
    {
        path: '/deeplink',
        name: 'deeplink',
        component: Deeplink,
    },
    {
        name: 'connect',
        path: '/connect',
        component: PopupConnect,
        props: true,
        meta: {
            notPersist: true,
        },
    },
    {
        path: '/settings',
        component: Settings,
        meta: {
            title: 'settings',
        },
    },
    {
        path: '/generalSettings',
        component: GeneralSettings,
        meta: {
            title: 'general',
        },
    },
    {
        path: '/securitySettings',
        name: 'settings-security',
        component: SecuritySettings,
        meta: {
            title: 'security',
        },
    },
    {
        path: '/backupWallet',
        name: 'backup-wallet',
        component: BackupWallet,
        meta: {
            title: 'backup-wallet',
        },
    },
    {
        path: '/restoreWallet',
        name: 'restore-wallet',
        component: RestoreWallet,
        meta: {
            title: 'restore-wallet',
            ifNotAuthOnly: true        },
    },
    {
        path: '/aboutSettings',
        component: AboutSettings,
        meta: {
            title: 'about',
        },
    },
    {
        path: '/termsOfService',
        component: TermsOfService,
        meta: {
            title: 'terms',
            ifNotAuth: true,
        },
    },
    {
        path: '/privacyPolicy',
        component: PrivacyPolicy,
        meta: {
            title: 'privacy',
        },
    },
    {
        path: '/importAccount',
        component: ImportAccount,
        meta: {
            title: 'importAccount',
            ifNotAuthOnly: true,
        },
    },
    {
        path: '/intro',
        component: Intro,
        meta: {
            ifNotAuthOnly: true,
            notPersist: true,
        },
    },
    {
        path: '/networks',
        component: Networks,
        props: true,
        meta: {
            title: 'networks',
        },
    },
    {
        name: 'address',
        path: '/address',
        component: Address,
        meta: {
            title: 'address',
            notPersist: true,
        },
    },
    {
        name: 'not-found',
        path: '*',
        component: NotFound,
        meta: {
            ifNotAuth: true,
        },
    },
    {
        name: 'sign-message',
        path: '/sign-message',
        component: SignMessage,
        meta: {
            title: 'sign-message',
            notPersist: true,
        },
    },
    {
        name: 'profile',
        path: '/profile',
        component: Profile,
        props: true,
        meta: {
            title: 'profile',
        },
    },
    {
        name: 'credential',
        path: '/credential',
        component: Credentials,
        props: true,
        meta: {
            title: 'credential',
        },
    },
    {
        name: 'credentialDetails',
        path: '/credential/:credentialId',
        component: CredentialsDetails,
        props: true,
        meta: {
            title: 'credentialDetails',
        }
    },
    {
        name: 'CredentialsDetailsTemp',
        path: '/credential/temp/:credentialId',
        component: CredentialsDetailsTemp,
        props: true,
        meta: {
            title: 'credentialDetailsTemp'
        }
    },
    {
        name: 'CredentialsDetailsAuthorize',
        path: '/credential/authorize/:credentialId',
        component: CredentialsDetailsAuthorize,
        props: true,
        meta: {
            title: 'credentialDetailsAuthorize'
        }
    },
    ...webIframePopups,
];