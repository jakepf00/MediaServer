from yattag import Doc

# Yattag document setup
doc, tag, text = Doc().tagtext()

# HTML definition
doc.stag('!DOCTYPE', html='')
with tag('html'):
    with tag('head'):
        doc.stag('link', rel='stylesheet', href='admin/admin.css')
    with tag('body'):
        with tag('div', klass="header"):
            with tag('a', href="index", klass="logo"):
                text("Media Server")
            with tag('div', klass="header-right"):
                with tag('a', href="#"):
                    text("Settings")
        with tag('button', id="selectRootFolderButton"):
            text('Select library root folder')
        with tag('script', src='admin/admin.js'):
            text('')

# Returning HTML results
print(doc.getvalue())