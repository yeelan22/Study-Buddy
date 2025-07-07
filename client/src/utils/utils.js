import dashboardIcon from '../assets/dashboard.svg';
import settingsIcon from '../assets/settings.svg';
import calendarIcon from '../assets/calendar.svg';
import flachCards from '../assets/card-text.svg';
import chatIcon from '../assets/chat-text.svg';
import journalIcon from '../assets/journals.svg'; 
import mindMapIcon from '../assets/mindMap.svg';
import noteIcon from '../assets/note.svg';
export const links = [
    {
        id: 1,
        icon: dashboardIcon,
        name: "Dashboard",
        to: "/app/dashboard"
    },
    {
        id: 2,
        icon: chatIcon,
        name: "Chat Smart",
        to: "/app/chatSmart"
    },
    {
        id: 3,
        icon:  noteIcon,
        name: "Upload Notes",
        to: "/app/uploadNotes"
    },
    {
        id: 4,
        icon: calendarIcon,
        name: "Goal Breakdown",
        to: "/app/goalBreakdown"
    },
    {
        id: 5,
        icon: mindMapIcon,
        name: "Mind Map",
        to: "/app/mindMap"
    },
    {
        id: 6,
        icon: journalIcon,
        name: "Journal Toughts",
        to: "/app/journalToughts"
    },
    {
        id: 7,
        icon: flachCards,
        name: "Memory Zone",
        to: "/app/memoryZone"
    },
    {
        id: 8,
        icon: settingsIcon,
        name: "Settings",
        to: "/app/settings"
    }
]