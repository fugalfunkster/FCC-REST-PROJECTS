# Free Code Camp RESTful API Projects

I wrote these REST APIs as part of the FreeCodeCamp cirriculum.
Originally, these APIs each had their own workspace on Cloud9,
and their own git repo, but that seemed unnecessary, so I refactored
them into a single workspace and added comments to help me
remember what I learned – while these projects are still fresh in my mind.

Eventually, I will provide an HTML doc at each '/' endpoint, describing
how to use the API.

## The Projects

1. Timestamp Microservice
  - User Story: I can pass a string as a parameter, and it will
    check to see whether that string contains either a unix timestamp
    or a natural language date (example: January 1, 2016).
  - User Story: If it does, it returns both the Unix timestamp and
    the natural language form of that date.
  - User Story: If it does not contain a date or Unix timestamp,
    it returns null for those properties.

2. Request Header Parser Microservice
  - User Story: I can get the IP address, language and operating
    system for my browser.

3. URL Shortener Microservice
  - User Story: I can pass a URL as a parameter and I will receive a
    shortened URL in the JSON response.
  - User Story: If I pass an invalid URL that doesn't follow the
    valid http://www.example.com format, the JSON response will contain
    an error instead.
  - User Story: When I visit that shortened URL, it will redirect me to
    my original link.

4. Image Search Abstraction Layer
  - User Story: I can get the image URLs, alt text and page urls for a
    set of images relating to a given search string.
  - User Story: I can paginate through the responses by adding a
    ?offset=2 parameter to the URL.
  - User Story: I can get a list of the most recently submitted search
    strings.

5. File Metadata Microservice
  - User Story: I can submit a FormData object that includes a file upload.
  - User Story: When I submit something, I will receive the file size in
    bytes within the JSON response.