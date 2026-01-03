(function(document, navigator, standalone) {
    // แก้ปัญหาลิงก์เด้งออกจากหน้าแอปบน iOS
    if ((standalone in navigator) && navigator[standalone]) {
        var cnode, remNodes = false,
            target = false;
        document.addEventListener('click', function(event) {
            cnode = event.target;
            while (cnode.nodeName !== 'A' && cnode.nodeName !== 'HTML') {
                cnode = cnode.parentNode;
            }
            if ('href' in cnode && cnode.href.indexOf('http') !== -1 && (cnode.href.indexOf(document.location.host) !== -1 || remNodes)) {
                event.preventDefault();
                document.location.href = cnode.href;
            }
        }, false);
    }
})(document, window.navigator, 'standalone');
