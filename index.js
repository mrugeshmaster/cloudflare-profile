const links = [
  { "name": "GitHub", "url": "https://www.github.com/mrugeshmaster" },
  { "name": "LinkedIn", "url": "https://www.linkedin.com/in/mrugesh-master" },
  { "name": "Instagram", "url": "https://www.instagram.com/mrugeshmaster" }
]

addEventListener("fetch", event => {
  const original_request = event.request
  if (original_request.url.includes("/links")) {
    return event.respondWith(
      new Response(JSON.stringify(links,null,2), {
        headers: {
          "content-type": "application/json;charset=UTF-8"
        }
      })
    )
  }
  else {
    return event.respondWith(setUpHTML())
  }
})

class LinksTransformer {
  constructor(links) {
    this.links = links 
  }
  
  async element(element) {
    console.log(`Incoming element: ${element.tagName}`)
    for(var i=0;i<links.length;i++) {
      var link_url = links[i]["url"]
      var link_name = links[i]["name"]
      console.log(link_url + " " + link_name)
      element.append("<a href=" + link_url + "> " + link_name + "</a>",{html:true})
    }
  }
}

class ProfileTransformer {
  async element(element) {
    if (element.tagName=="div" && element.getAttribute("style"))
      element.removeAttribute("style")
  }
}

class SocialTransformer {
  async element(element) {
    console.log(`Incoming element: ${element.tagName}`)
    if ( element.getAttribute("style"))
      element.removeAttribute("style")
    element.append(`<a href=${links[0]["url"]}> 
                      <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">       
                        <image href="https://unpkg.com/simple-icons@v3/icons/github.svg" height="32" width="32"/>
                      </svg> 
                    </a>`,
                  {html:true})
    element.append(`<a href=${links[1]["url"]}> 
                      <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">       
                        <image href="https://unpkg.com/simple-icons@v3/icons/linkedin.svg" height="32" width="32"/>
                      </svg> 
                    </a>`,
                  {html:true})
    element.append(`<a href=${links[2]["url"]}> 
                      <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">       
                        <image href="https://unpkg.com/simple-icons@v3/icons/instagram.svg" height="32" width="32"/>
                      </svg> 
                    </a>`,
                  {html:true})
  }
}

const rewriter = new HTMLRewriter()
                .on("div#links",new LinksTransformer(links))
                .on("div#social", new SocialTransformer())
                .on("div#profile", {
                  element(element) {
                    if (element.tagName=="div" && element.getAttribute("style"))
                      element.removeAttribute("style")
                  },
                })
                .on("img#avatar", {
                  element(element) {
                    element.setAttribute("src","https://avatars2.githubusercontent.com/u/60305253?s=460&u=fbab1b4702fea7cbdd93ef95fe8bee79cda61d89&v=4")
                  },
                })
                .on("h1#name", {
                  element(element) {
                    element.setInnerContent("Mrugesh Master")
                  },
                })
                .on("title", {
                  element(element) {
                    element.setInnerContent("Mrugesh Master")
                  },
                })
                .on("body", {
                  element(element) {
                    element.setAttribute("class","bg-teal-900")
                  }
                })

async function setUpHTML() {
  const url = "https://static-links-page.signalnerve.workers.dev"
  // const init = {
  //   headers: {
  //     "content-type": "application/json;charset=UTF-8",
  //   },
  // }
  const res = await fetch(url)
  // const html_doc = new Response(await response.text(), init)
  // rewriter.transform(html_doc)
  // return new Response("hello")
  return rewriter.transform(res)
}

