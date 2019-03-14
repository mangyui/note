if (typeof jQuery !== "undefined" && typeof saveAs !== "undefined") {
  (function($) {
      $.fn.wordExport = function(fileName) {
          fileName = typeof fileName !== 'undefined' ? fileName : "jQuery-Word-Export";
          var mystatic = {
              mhtml: {
                  top: "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>",
                  head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n",
                  body: "<body>_body_</body>"
              }
          };
          var options = {
              maxWidth: 624
          };
          // Clone selected element before manipulating it
          var markup = $(this).clone();

          // Remove hidden elements from the output
          markup.each(function() {
              var self = $(this);
              if (self.is(':hidden'))
                  self.remove();
          });

          // Embed all images using Data URLs
          var images = Array();
          var img = markup.find('img');
          for (var i = 0; i < img.length; i++) {
              // Calculate dimensions of output image
              var w = Math.min(img[i].width, options.maxWidth);
              var h = img[i].height * (w / img[i].width);

              // 修改
              // img[i].setAttribute("id", "test_img_" + i)
              // var img_id = "#"+img[i].id;
              // var v = $('<canvas>').attr("id", "test_word_img_" + i).width(w).height(h);
              // v.insertAfter(img_id);
              // console.log(v);
              //  var data = v.toDataURL("image/png");
              // img[i].setAttribute("src", data);

              // 删除
              // Create canvas for converting image to data URL
              var imgs = img[i]
              imgs.crossOrigin = 'anonymous'
              // img[i].setAttribute('crossOrigin','*')
              console.log(img[i])
              img[i].onload = function(){
                var canvas = document.createElement("CANVAS");
                // console.log("CANVAS"+i,canvas)
                canvas.width = w;
                canvas.height = h;
                // Draw image to canvas
                var context = canvas.getContext('2d');
                context.drawImage(img[i], 0, 0, w, h);
                // Get data URL encoding of image
                console.log(canvas)
                var uri = canvas.toDataURL("image/jpg");
                $(img[i]).attr("src", uri);
                img[i].width = w;
                img[i].height = h;
                // Save encoded image to array
                images[i] = {
                    type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
                    encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
                    location: $(img[i]).attr("src"),
                    data: uri.substring(uri.indexOf(",") + 1)
                };
              }
          }

          // Prepare bottom of mhtml file with image data
          var mhtmlBottom = "\n";
          for (var i = 0; i < images.length; i++) {
              mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
              mhtmlBottom += "Content-Location: " + images[i].location + "\n";
              mhtmlBottom += "Content-Type: " + images[i].type + "\n";
              mhtmlBottom += "Content-Transfer-Encoding: " + images[i].encoding + "\n\n";
              mhtmlBottom += images[i].data + "\n\n";
          }
          mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";

          //TODO: load css from included stylesheet
          var styles = ".test_title{display: flex;margin: 20px 0 15px;}.test_index{margin-right: 5px;line-height: 1.8em;}.test_content{line-height: 1.8em;}.test_Correct{line-height: 1.8em; font-size: 15px;} table,th,td{border:0}";

          // Aggregate parts of the file together
          var fileContent = mystatic.mhtml.top.replace("_html_", mystatic.mhtml.head.replace("_styles_", styles) + mystatic.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom;

          // Create a Blob with the file contents
          var blob = new Blob([fileContent], {
              type: "application/msword;charset=utf-8"
          });
          window.saveAs(blob, fileName + ".doc");
          alert('文件保存'+fileName + ".doc")
      };
  })(jQuery);
} else {
  if (typeof jQuery === "undefined") {
      console.error("jQuery Word Export: missing dependency (jQuery)");
  }
  if (typeof saveAs === "undefined") {
      console.error("jQuery Word Export: missing dependency (FileSaver.js)");
  }
}
