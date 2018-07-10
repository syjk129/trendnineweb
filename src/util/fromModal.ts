export default function fromModal(location: any, nextLocation: any) {
    return (
        location.pathname.includes("share") ||
        location.pathname.includes("login") ||
        location.pathanme.includes("onboarding")
    );
}
