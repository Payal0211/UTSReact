export const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    // Order matters: Edge and Opera also contain "Chrome", Chrome also contains "Safari"
    const rules = [
        ['Edge', /Edg\/([\d.]+)/],
        ['Opera', /OPR\/([\d.]+)/],
        ['Chrome', /Chrome\/([\d.]+)/],
        ['Firefox', /Firefox\/([\d.]+)/],
        ['Safari', /Version\/([\d.]+).*Safari/],
    ];
    let browserName = 'Unknown';
    let browserVersion = '';
    for (const [name, regex] of rules) {
        const match = ua.match(regex);
        if (match) {
            browserName = name;
            browserVersion = match[1];
            break;
        }
    }
    return {
        browserName,
        browserVersion,
        os: navigator.userAgentData?.platform || navigator.platform || 'Unknown',
        userAgent: ua,
    };
};