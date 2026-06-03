self.addEventListener("push", (event) => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: "/icon.png",
    };
    event.waitUntil(self.registration.showNotification(data.heading, options));
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow("/rc-pulse/get"));
});
