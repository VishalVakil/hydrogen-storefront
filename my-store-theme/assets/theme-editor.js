!function(){"use strict";document.addEventListener("shopify:block:select",(t=>{const e=t.target.hasAttribute("data-collapsible")?t.target:null;e&&!e?.hasAttribute("open")&&e.querySelector("[data-collapsible-trigger]")?.dispatchEvent(new Event("click"));if(t.target.hasAttribute("data-slide")){const e=t.target.closest("[data-slider]");e&&setTimeout((()=>{e.scrollTo({left:t.target.offsetLeft})}),200)}const a=t.target.matches("ticker-bar")?t.target:t.target.querySelector("ticker-bar")||t.target.closest("ticker-bar");a&&a.setAttribute("paused","")})),document.addEventListener("shopify:block:deselect",(t=>{const e=t.target.hasAttribute("data-collapsible")?t.target:null;e&&e.hasAttribute("open")&&e.querySelector("[data-collapsible-trigger]")?.dispatchEvent(new Event("click"));const a=t.target.matches("ticker-bar")?t.target:t.target.querySelector("ticker-bar")||t.target.closest("ticker-bar");a&&a.removeAttribute("paused")}));const t=Shopify.theme.role??"unknown";(!localStorage.getItem("cc-settings-loaded")||localStorage.getItem("cc-settings-loaded")!==t)&&fetch("https://mantle-mu.vercel.app/api",{headers:{"Content-Type":"application/x-www-form-urlencoded"},method:"POST",mode:"cors",body:new URLSearchParams({shop:Shopify.shop,theme:theme.info?.name??"",version:theme.version??"",role:t,platformPlanName:t,platformId:document.querySelector("script[src*=theme-editor][data-owner-id]")?.dataset.ownerId,contact:document.querySelector("script[src*=theme-editor][data-owner-email]")?.dataset.ownerEmail})}).then((e=>{e.ok&&localStorage.setItem("cc-settings-loaded",t)}))}();
//# sourceMappingURL=theme-editor.js.map
