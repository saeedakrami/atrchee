

// const postsDirectory = path.join(process.cwd(), 'pages/backFromPayment');

export function getPaymentId() {
    // const fileNames = fs.readdirSync(postsDirectory)
    // console.log(fileNames)
    // // Returns an array that looks like this:
    // // [
    // //   {
    // //     params: {
    // //       id: 'ssg-ssr'
    // //     }
    // //   },
    // //   {
    // //     params: {
    // //       id: 'pre-rendering'
    // //     }
    // //   }
    // // ]
    // return fileNames.map(fileName => {
    //   return {
    //     params: {
    //       id: fileName.replace(/\.md$/, '')
    //     }
    //   }
    // })
  }

  export function getPostData(id) {
      console.log(id)
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
  
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)
  
    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  }