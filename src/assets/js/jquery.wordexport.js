if (typeof jQuery !== "undefined") {
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

              // Create canvas for converting image to data URL
              var imgs = img[i]
              // imgs.crossOrigin = 'anonymous'
              // img[i].setAttribute('crossOrigin','*')

              // 目前只能用绝对地址超链接方式来加载图片，base64 word不能显示。
              // 其他方式未知/
              // 强制将https转换为http,https不显示可能是因为安全问题。
              var urlNos = $(img[i]).attr("src").substring(4,5);
              // console.log(urlNos)
              if(urlNos=="s"){
                imgs.src = "http"+$(img[i]).attr("src").substring(5);
              }
              // console.log(img[i])
              img[i].onload = function(){
              // img[i].onload = function(){
                var canvas = document.createElement("CANVAS");
                // console.log("CANVAS"+i,canvas)
                canvas.width = w;
                canvas.height = h;
                // Draw image to canvas
                var context = canvas.getContext('2d');
                context.drawImage(this, 0, 0, w, h);
                // Get data URL encoding of image
                // var uri = canvas.toDataURL("image/jpg");
                // $(this).attr("src", uri);
                // this.width = w;
                // this.height = h;
                // // Save encoded image to array
                // images[i] = {
                //     type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
                //     encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
                //     location: $(this).attr("src"),
                //     data: uri.substring(uri.indexOf(",") + 1)
                // };
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
          var styles = "table,th,td{border:0}";

          // Aggregate parts of the file together
          var fileContent = mystatic.mhtml.top.replace("_html_", mystatic.mhtml.head.replace("_styles_", styles) + mystatic.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom;

          // Create a Blob with the file contents
          var blob = new Blob([fileContent], {
              type: "application/msword;charset=utf-8"
          });
          // a 连接点击方式 省去了FileSaver类
          // var a = document.createElement('a');
          // a.target = '_blank';
          // a.innerHTML = fileName;
          // // 指定生成的文件名
          // a.download = fileName + ".doc";
          // a.href = URL.createObjectURL(blob);
          // document.body.appendChild(a);
          // a.click();
          // document.body.removeChild(a);
          // alert(URL.createObjectURL(blob))
          // $("#alink").attr("href", URL.createObjectURL(blob))
          // var uri = encodeURI(URL.createObjectURL(blob))
          // var fileTransfer = new FileTransfer();
          // fileTransfer.download(
          //   'http://blog.mccyu.com/img/avatar.gif',
          //   "filepath",
          //   function(entry) {
          //     console.log("download complete: " + entry.toURL());
          //   },
          //   function(error) {
          //       console.log("download error source " + error.source);
          //       console.log("download error target " + error.target);
          //       console.log("download error code" + error.code);
          //   },
          //   true,
          //   {
          //       headers: {
          //           // "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
          //       }
          //   }
          // );
          // $("#alink").click();
          // 跳转 ，为了让手机端能够看到 无奈
          //  window.location.href = URL.createObjectURL(blob)
          // window.open(URL.createObjectURL(blob),'_system')
          // 原方式
          // window.saveAs(blob, fileName + ".doc")
          return blob
      };
  })(jQuery);
} else {
  if (typeof jQuery === "undefined") {
      console.error("jQuery Word Export: missing dependency (jQuery)");
  }
}
