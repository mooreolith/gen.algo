/*

genetic.algo.js

= Genetic Algo =

Joshua Marshall Moore
mooreolith@proton.me
July 22nd, 2022

This program morphs strings into different strings.

*/

var fs = require('fs')

var Gene = class Gene {
  constructor(code){
    this.code = code.slice()
    this.cost = 9999
  }
  
  mate(gene){
    var middle = Math.floor(this.code.length / 2)
    return [
      new Gene(this.code.slice(0, middle).concat(
        gene.code.slice(middle))),
      new Gene(gene.code.slice(0, middle).concat(
        this.code.slice(middle)))
    ]
  }
  
  mutate(rate=0.5){
    if(Math.random() < rate) return false
    
    var code = ''
    var index = Math.round(Math.random() * this.code.length)
    
    for(var i=0; i<this.code.length; i++){
      var upOrDown = Math.round(Math.random()) ? -1 : 1
      
      if((i == index) 
         && String.fromCodePoint(
        this.code.codePointAt(i) + upOrDown)){
        code += String.fromCodePoint(
          this.code.codePointAt(i) + upOrDown)
      }else{
        code += this.code[i]
      }
    }
    
    this.code = code.slice()
    return this.code
  }
  
  random(length){
    this.code = ''
    for(var i=0; i<length; i++){
      var c = String.fromCharCode(
        Math.round(Math.random() * 127) + 32);
      this.code = this.code.concat(c)
    }
    
    return this
  }
  
  calcCost(target){
    var total = 0.0
    for(var i=0; i<this.code.length; i++){
      total += (this.code.codePointAt(i) - target.codePointAt(i)) *
        (this.code.codePointAt(i) - target.codePointAt(i))
    }
    
    this.cost = total
    return this.cost
  }
}

var Population = class Population {
  constructor(target="Greetings, Worlds!", size=100, logCosts=true){
    this.target = target
    this.members = []
    for(var i=0; i<size; i++){
      var gene = new Gene('')
      gene.random(this.target.length)
      gene.calcCost(this.target)
      this.members.push(gene)
    }
    this.generationNumber = 0
  
    this.logCosts = logCosts
    if(this.logCosts){
      this.costLog = []
    }
  }
  
  calcCosts(){
    for(var member of this.members){
      member.calcCost(this.target)
    }
  }
  
  mutate(rate){
    for(var member of this.members){
      member.mutate(rate)
    }
  }
  
  sort(){
    this.members.sort((a, b) => a.cost - b.cost)
  }
  
  display(){
    this.calcCosts()
    this.sort()
    
    var code = this.members[0].code.slice()
    var clean = ''
    for(var c of code){
      if(/[:print:&&^\\n]/.test(c)){
        clean = clean.concat(c)
      }else{
        clean = clean.concat('.')
      }
    }
    
    process.stdout.write(clean + '\r')
  }
  
  genotype(rate=0.5, display=true){
    while(!this.generation(display)) continue

    if(this.logCosts){
      return this.costLog
    }else{
      return this.generationNumber
    }
  }
  
  generation(rate=0.5, display=true){
    this.members.map(m => m.mutate(rate))
    this.members.map(m => m.calcCost(this.target))
    
    var children = this.members[0].mate(this.members[1])
    this.members.splice(
      this.members.length - 2, 1, 
      children[0])
    this.members.splice(
      this.members.length - 1, 
      1, 
      children[1])
    
    this.calcCosts()
    this.sort()
    if(this.logCosts){
      this.costLog.push(this.members[0].cost)
    }
    
    if(display){
      this.display()
    }
    
    this.generationNumber += 1
    
    if(this.members[0].code == this.target){
      return true
    }
    
    return false;
  }
}

var evolve = function evolve(word){
  var population = new Population(
    target=word, 
    size=10, 
    logCosts=false)
  
  while(!population.generation(rate=0.5, display=true)){
    // process.stdout.write(population.members[0].code + '\r')
  }
  
  process.stdout.write(population.members[0].code + '\n')
}

exports.Gene = Gene
exports.Population = Population
exports.evolve = evolve

if(require.main === module){
  for(var j=2; j<process.argv.length; j++){
    if(fs.existsSync(process.argv[j])){
      fs.readFile(process.argv[j], 'utf8', function(err, data){
        data.split('\n').map(line => evolve(line))
      })
    }else{
      for(var i=2; i<process.argv.length; i++){
        evolve(process.argv[i])
      }
    }
  }
}
