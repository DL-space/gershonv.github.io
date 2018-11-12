function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF()
    let next
    function step(nextF) {
      let next
      try {
        next = nextF()
      } catch (err) {
        return reject(err)
      }
      if (next.done)  return resolve(next.value)
      Promise.resolve(next.value).then(
        v => step(() => gen.next(v)), 
        e => gen.throw(e)
      )
    }
    step(() => gen.next(undefined))
  })
}
