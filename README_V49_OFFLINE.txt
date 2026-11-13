Raesya WonderLand V49 OFFLINE + ANTI-ZOOM

1. Backup your existing iPhone learning data first. Do not delete the current Home Screen app or clear Safari data.
2. Upload ALL application files/subfolders from this ZIP to the SAME GitHub Pages folder, replacing previous versions, including the new service-worker.js. Do not upload the ZIP alone.
3. With internet ON, open the GitHub Pages URL in Safari, wait for Offline Ready. If necessary tap Prepare Offline; DO NOT close Safari until Offline Ready.
4. Test Airplane Mode by closing and reopening the Home Screen app. For laptop, opening index.html directly from the extracted folder also works without internet (the app uses local JS/assets). Chrome/Edge hosted copy may be installed as a PWA after Offline Ready.
5. Offline data is independent for each device. No sync required.
6. iOS accessibility system zoom and some browser-controlled zoom cannot be fully disabled by a website. Pinch/double tap suppression here is best-effort; single-finger game gestures and scrolling remain supported.

Technical note: Service Worker activates quickly; complete asset bundle is downloaded into Cache Storage by the page, with progress and retry. Safari may evict site storage under pressure, so offline status should be rechecked after updates. Not tested on physical iPhone yet.
