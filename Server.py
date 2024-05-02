import http.server
import os

class RequestHandler(http.server.BaseHTTPRequestHandler):
    Error_Page = '''\
<html>
<body>
    <h1>Error accessing {path}</h1>
    <p>{msg}</p>
</body>
</html>
'''

    # Classify and handle request
    def do_GET(self):
        try:
            self.full_path = os.getcwd() + self.path
            temp = self.full_path.split('?')
            if len(temp) > 1:
                full_path, queries = temp[0], temp[1]
            else:
                full_path = self.full_path
                queries = ""
            
            # Run CGI file
            if os.path.isdir(full_path):
                filename = full_path.split('/')[1]
                cmd = "python " + full_path + "/" + filename + ".py " + queries
                process = os.popen(cmd)
                data = process.read().encode("utf-8")
                process.close()
                self.send_content(data)
            # Send other file
            elif os.path.isfile(full_path):
                try:
                    with open(full_path, 'rb') as reader:
                        content = reader.read()
                    self.send_content(content)
                except IOError as msg:
                    msg = "'{0}' cannot be read: {1}".format(full_path, msg)
                    self.handle_error(msg)
            
        # Handle errors
        except Exception as msg:
            self.handle_error(msg)

    def handle_error(self, msg):
        content = self.Error_Page.format(path = self.path, msg = msg).encode("utf-8")
        self.send_content(content, 404)
    
    def send_content(self, content, status = 200):
        self.send_response(status)
        self.send_header("Content-Type", "text/html")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

#-----------------------------------------------------------
if __name__ == '__main__':
    serverAddress = ('', 8080) # '' = localhost
    server = http.server.HTTPServer(serverAddress, RequestHandler)
    server.serve_forever()