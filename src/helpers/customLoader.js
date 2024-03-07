export const customLoader = (status) => {
   
   
    if(status) {
         const html = document.querySelector('html')
    let tmpLoaderWr = document.createElement('div')
    tmpLoaderWr.classList.add('temploaderWrapper')
    tmpLoaderWr.innerHTML = `
    <div class="lds-facebook">
          <div></div>
          <div></div>
          <div></div>
        </div>
    `
    html.insertAdjacentElement('afterbegin', tmpLoaderWr)
    const temploaderWrapper = document.querySelector('.temploaderWrapper')
        temploaderWrapper.style.display='flex'
        
        html.style.overflow = 'hidden';
        return 
    }

    if(!status) {
         const temploaderWrapper = document.querySelector('.temploaderWrapper')
         if(temploaderWrapper) {
        temploaderWrapper.remove()
        }
        return
    }

}