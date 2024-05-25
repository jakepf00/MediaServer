import http.server
import json
import os
from pathlib import Path
from urllib.parse import urlparse, parse_qs

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
            parsed_url = urlparse(self.path)
            queries = parse_qs(parsed_url.query)
            self.full_path = os.getcwd() + parsed_url.path

            # Send file directory
            if parsed_url.path == '/files':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                if 'directory' in queries.keys():
                    directory = os.path.join(Path.home(), queries['directory'][0])
                else:
                    directory = Path.home()
                files = [d for d in os.listdir(directory) if os.path.isdir(os.path.join(directory, d))]
                self.wfile.write(json.dumps(files).encode('utf-8'))
            # Run CGI file
            elif os.path.isdir(self.full_path):
                filename = self.full_path.split('/')[1]
                cmd = "python " + self.full_path + "/" + filename + ".py " + " ".join([key + "=" + val[0] for key, val in queries.items()])
                process = os.popen(cmd)
                data = process.read().encode("utf-8")
                process.close()
                self.send_content(data)
            # Send other file
            elif os.path.isfile(self.full_path):
                try:
                    if 'Range' in self.headers:
                        # Parse the Range header.
                        range_header = self.headers['Range']
                        file_size = os.path.getsize(self.full_path)
                        start, end = range_header.split('=')[1].split('-')
                        start = int(start)
                        end = int(end) if end else file_size - 1
                        # Read the requested range from the file.
                        with open(self.full_path, 'rb') as f:
                            f.seek(start)
                            content = f.read(end - start + 1)
                        # Send the requested range to the client.
                        self.send_response(206)
                        self.send_header('Content-Range', 'bytes {}-{}/{}'.format(start, end, file_size))
                        self.send_header('Content-Length', len(content))
                        self.end_headers()
                        self.wfile.write(content)
                    else:
                        with open(self.full_path, 'rb') as reader:
                            content = reader.read()
                            self.send_content(content)
                except IOError as msg:
                    msg = "'{0}' cannot be read: {1}".format(self.full_path, msg)
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