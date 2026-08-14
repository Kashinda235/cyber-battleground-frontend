import {DefenseDashboard} from "./Dash_trial.tsx";
import DefenseDashboardInteractive from './DefenceDashboard';
import DefenseControlCenter from "./DefenseCenter.tsx";
import SystemDefensePanel from "./Systedefenseanel.tsx";
import MaintenancePanel from "./Maintenance.tsx";
import FirewallPanel from "./Firewall.tsx";
import IDSPanel from "./IDS.tsx";
import HoneypotPanel from "./Honeypot.tsx";
import PlayerProfileCard from "../Feed/Profile.tsx";
import NetworkLogger from "../ActivityLog/NetworkLogger.tsx";

const TestApp = ( { test = 2 }) => {

    return (
        <div>
            {test === 1 && <DefenseDashboard/>}
            {test === 2 && <DefenseDashboardInteractive />}
            {test === 3 && <DefenseControlCenter />}
            {test === 4 && <SystemDefensePanel />}
            {test === 5 && <MaintenancePanel />}
            {test === 6 && <FirewallPanel />}
            {test === 7 && <IDSPanel />}
            {test === 8 && <HoneypotPanel />}
            {test === 9 && <PlayerProfileCard />}
            {test === 10 && <NetworkLogger />}
        </div>
    )
}
export default TestApp
