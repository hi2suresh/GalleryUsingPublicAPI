     $(document).ready(function(){
        /********************************
        Variables for Movies
        ********************************/
         var movieList = $('#movie-list');
         var moviesName = ['The Departed','Django Unchained', 'The Shawshank Redemption', 'The Green Mile','Pulp Fiction','The Dark Knight', 'The Bucket List', 'The Sixth Sense'];
         var sortableMoviesByYear = [];
         var sortedMoviesByYear = [];
        //Movie details to be shown in lightbox mode  
        var movieGalleryDetails = {
             titleSrc: function(item) {
                 var imageTitle = item.el[0].title;
                 var objStoredMovies = JSON.parse(localStorage.getItem('storedMovieDetails'));
                 var $title = $('<p class="gallery-details"></p>');
                 $title.text('Title: ' + imageTitle);
                 
                 var $released = $('<p class="gallery-details"></p>');
                 $released.text('Released: ' + objStoredMovies[imageTitle].Released);
                 
                 var $plot = $('<p></p>');
                 $plot.text('Plot: ' + objStoredMovies[imageTitle].Plot);
                 
                 var $awards = $('<p></p>');
                 $awards.text('Awards: ' + objStoredMovies[imageTitle].Awards);
                 
                 return $title.html() + '<br/>' + $released.html() + '<br/>' + $plot.html() + '<br/>' + $awards.html();
             }
        };
        //Get movie details from local storage if it exists
        var objStoredMovies = JSON.parse(localStorage.getItem('storedMovieDetails'));
        if(objStoredMovies === null){
                getMovieDetails();
            }
        else{
            appendMovieList(moviesName);
            invokeMagnificientPopup($('#movie-list a'), movieGalleryDetails);
        }
        /********************************
        Get movie details from OMDB API
        ********************************/
        function getMovieDetails(){
         var objMovies = {};
         for(let i=0; i<moviesName.length; i++){
         $.ajax({
                url : 'http://www.omdbapi.com/',
                type : 'GET',
                data : {
                    't' : moviesName[i]
                },
                dataType:'json',
                success : function(data) {
                   
                    objMovies[moviesName[i]] = data;
                    //Store movie name and its year for sorting purpose
                    sortableMoviesByYear.push([moviesName[i],data.Year]);                    
                    createList(movieList,data.Poster, data.Title);
                },
                error : function(request,error)
                {
                    alert("Request: "+JSON.stringify(request));
                }
         });
        }
        //After all of the ajax calls are complete, store the movie details in local storage    
        $(document).ajaxStop(function() {
                localStorage.setItem('storedMovieDetails',JSON.stringify(objMovies));
                var tempSortedMoviesByYear =  sortableMoviesByYear.sort(function(a,b){           
                                        return parseInt(a[1]) - parseInt(b[1]);
                                    });
                 for(let i=0; i<tempSortedMoviesByYear.length; i++){
                     sortedMoviesByYear.push(tempSortedMoviesByYear[i][0]);
                 }
                localStorage.setItem('sortedMoviesByYear',JSON.stringify(sortedMoviesByYear)); 
                invokeMagnificientPopup($('#movie-list a'), movieGalleryDetails);
            });      
       
    }
         //Append Movie List Images
         function appendMovieList(movieArray){
             for(let i=0; i<movieArray.length; i++){
                createList(movieList,objStoredMovies[movieArray[i]].Poster, movieArray[i]);
            }
        }
        
        
        //Add event listener movie sort button
        $('#movie-sort-button').click(function(){
            objStoredMovies = JSON.parse(localStorage.getItem('storedMovieDetails'));
            sortedMoviesByYear =  JSON.parse(localStorage.getItem('sortedMoviesByYear'));
            //Remove the previously created list items
            $("#movie-list").empty();
            appendMovieList(sortedMoviesByYear);
            invokeMagnificientPopup($('#movie-list a'), movieGalleryDetails);
        });        
     
        /********************************
        Create Images List in the Web page
        ********************************/
        function createList(parentElement,dataImage,dataTitle){
            var $li = $('<li></li>');
            var $a = $('<a></a>');
            var $img = $('<img/>');

            $a.attr('href',dataImage);
            $a.attr('Title',dataTitle);            
            $img.attr('src',dataImage);
            $img.attr('alt',dataTitle);
            
            $a.append($img);
            $li.append($a);
            
            parentElement.append($li);
        }
         
         
        
        /********************************
        Variables for Books
        ********************************/
       var bookList = $('#book-list');
        var openLibraryURL = 'https://openlibrary.org/api/books';
        var coversURL = 'https://covers.openlibrary.org/b/';
        var books = ["OLID:OL10446359M", "OLID:OL7829767M", "OLID:OL23752075M", "OLID:OL6807492M", "OLID:OL10236418M", "OLID:OL8667035M", "OLID:OL24215162M", "OLID:OL8846075M"];         
        var booksName = [];
       //Book details to be shown in lightbox mode 
        var bookGalleryDetails = {
             titleSrc: function(item) {
                 var imageTittle = item.el[0].title;
                 var objStoredBooks = JSON.parse(localStorage.getItem('storedBookDetails'));
                 var $title = $('<p class="gallery-details"></p>');
                 $title.text('Title: ' + imageTittle);
                 var olid = objStoredBooks[imageTittle].OLID;
                 var $released = $('<p class="gallery-details"></p>');
                 $released.text('Released: ' + objStoredBooks[imageTittle][olid].publish_date);
                 
                 var $pages = $('<p class="gallery-details"></p>');
                 $pages.text('Number Of Pages: ' + objStoredBooks[imageTittle][olid].number_of_pages);
                                                  
                 return $title.html() + '<br/>' + $released.html() + '<br/>' + $pages.html();
             }
        };
        
        //Get Books details from local storage if it exists
        var objStoredBooks = JSON.parse(localStorage.getItem('storedBookDetails'));
        if(objStoredBooks === null){
                getBooksDetail();
            }
        else{
            var bookArray = JSON.parse(localStorage.getItem('storedBookNames'));
            appendBookList(bookArray);
            invokeMagnificientPopup($('#book-list a'), bookGalleryDetails);
        }
        
        
        /********************************
        Get Book details from OpenLib
        ********************************/
        function getBooksDetail(){
        var objBooks = {};
        for(let i=0; i<books.length; i++){
            $.ajax({
                    url :'https://openlibrary.org/api/books',
                    type : 'GET',
                    data : {
                        'bibkeys' : books[i],
                         jscmd:'data',
                    },
                    dataType:'jsonp',

                    success : function(data) {
                      objBooks[data[books[i]].title] = data;
                      objBooks[data[books[i]].title].coversURL =  coversURL + books[i].replace(':','/') +'-L.jpg';
                      objBooks[data[books[i]].title].OLID = books[i];
                      booksName.push(data[books[i]].title);
                      createList(bookList, objBooks[data[books[i]].title].coversURL, data[books[i]].title );
                    },
                    error : function(request,error)
                    {
                        alert("Request: "+JSON.stringify(request));
                    }
             });
            }
            //After all of the ajax calls are complete, store the book details in local storage
            $(document).ajaxStop(function() {
                localStorage.setItem('storedBookDetails',JSON.stringify(objBooks));               
                localStorage.setItem('storedBookNames',JSON.stringify(booksName)); 
                localStorage.setItem('sortedBookNames',JSON.stringify(booksName.sort())); 
                invokeMagnificientPopup($('#book-list a'), bookGalleryDetails);
            });            
        }
        
        //Append Book List Images
        function appendBookList(bookArray){
             for(let i=0; i<bookArray.length; i++){
                createList(bookList,objStoredBooks[bookArray[i]].coversURL, bookArray[i]);
            }
        }
        

        //Add event listener for Books sort button
         $('#book-sort-button').click(function(){
            objStoredBooks = JSON.parse(localStorage.getItem('storedBookDetails'));
            sortedBooks =  JSON.parse(localStorage.getItem('sortedBookNames'));
            //Remove the previously created list items
            $("#book-list").empty();
            appendBookList(sortedBooks);
            invokeMagnificientPopup($('#book-list a'), bookGalleryDetails);
            
        });       

        /***************************************
        Initialize Magnficient Popup for lightbox
        *****************************************/
        function invokeMagnificientPopup(parentGallery, galleryDetails){            
              parentGallery.magnificPopup({
                type: 'image',
                 gallery:{
                    enabled:true
                },
                image: galleryDetails
              });
        }
        
     });
    