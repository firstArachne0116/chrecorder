// NOTE: Setting includeParametersInDescription will print out additional parameters
// Is this valid for frequency modifiers? I think by our rules it is, but it sounds funny
// Check out: "usually gold to usually brown, or frequently green, and pre c frequently green solid abaxially, and pre c frequently green speckled abaxially, and pre c frequently green speckled different post c"

// Numerical values are for ordering ranges e.g. bright to dark
let CertaintyConstraint = {
	DOUBTFULLY : ["doubtfully", 0],
	POSSIBLY : ["possibly", 1],
	PRESUMABLY : ["presumably", 2],
	APPROXIMATELY : ["approximately", 3],
	DEFINITELY : ["definitely", 4]
}

let DegreeConstraint = {
	IMPERCEPTIBLY : ["imperceptibly", 0],
	SCARCELY : ["scarcely", 1],
	MODERATELY : ["moderately", 2],
	CONSIDERABLY : ["considerably", 3],
	EXTREMELY : ["extremely", 4],
}

let Brightness = {
	BRIGHT : ["bright", 0],
	MEDIUM : ["medium", 1],
	DARK : ["dark", 2],
}

let Saturation = {
	PALE : ["pale", 0],
	GRAY : ["gray", 1],
	PURE : ["pure", 2],
}

let Color = {
	WHITE : "white",
	BLACK : "black",
	GREEN : "green",
	YELLOW : "yellow",
	BROWN : "brown",
	GOLD : "gold",
	RED : "red",
	PURPLE : "purple",
}

let Colorsets = {
	white: new Set([Color.WHITE, Color.BLACK, Color.GREEN, Color.YELLOW, Color.BROWN, Color.GOLD, Color.RED, Color.PURPLE]),
	yellow: new Set([Color.BLACK, Color.GREEN, Color.YELLOW, Color.BROWN]),
	green: new Set([Color.BLACK, Color.GREEN, Color.BROWN]), // Color.YELLOW
	gold: new Set([Color.BLACK, Color.BROWN, Color.GOLD, Color.RED]),
	brown: new Set([Color.BLACK, Color.BROWN]), // Color.GOLD, Color.PURPLE, Color.RED
	red: new Set([Color.BLACK, Color.GREEN, Color.RED, Color.PURPLE, Color.BROWN]),
	purple: new Set([Color.BLACK, Color.BROWN, Color.PURPLE]),
	black: new Set([Color.BLACK])
}

// TODO: Subclass Quality for: shape, size, texture, pubescence
// Already subclassed: ColorQuality
class Quality {
	// constraints: [] used to determine clauses - same concept as pre and post constraints
	// color ex.: texture
	// rangeParameters: parameters elegible to form ranges
	// color ex.: brightness, reflectance
	constructor(quality, constraints, rangeParameters, otherParameters) {
		this.mainQuality = quality
		this.constraints = constraints
		this.rangeParameters = rangeParameters
	}
	// override me (required):
	// this helper method is used to determine clauses
	qualityConstraintsMatch(otherQuality) {}
    // override me (required):
	// this helper method is used to determined if <otherQuality> is eligible to be added to the same node.
	// EX: a bright green character and a dark green character would be "same quality" and this method would return true
	isSameQuality(otherQuality) {}
	// override me (required):
	// this helper method determines if this object points to <otherQuality>.
	// EX: <green quality>.isNextInRange(<brown quality>) would return true
	// but <brown quality>.isNextInRange(<green quality>) would return false
	isNextInRange(otherQuality) {}

	// helper method to take on quality and constraint descriptions
	static getQualityAndConstraintDescription(qualities) {
		var text = ""
		if (qualities[0].mainQuality != null) {
			text += qualities[0].mainQuality
		}
		qualities[0].constraints.forEach(function (constraint) {
			text += (constraint == null) ? "" : " " + constraint
		})
		return text
	}

	// helper method to get frequency modifer based on main
	static getFrequencyModifier(qualities, numCharacters) {
		let percentage = qualities.length / numCharacters
		if (qualities.length == numCharacters){
			return "";
		}
		else if (percentage >= .75){
			return "frequently "
		} else if (percentage >= .5){
			return "usually "
		} else if (percentage >= .25){
			return "sometimes "
		} else {
			return "rarely "
		}
	}

	// this helper class method is used to get the description of a range that only contains a SINGLE node
	static getFullDescription(qualities, numCharactersTotal) {
		var text = ""
		var minMaxTracker = []
		text += this.getFrequencyModifier(qualities, numCharactersTotal)

		qualities[0].rangeParameters.forEach(function (parameter) {
			minMaxTracker.push([null, null]) // [min, max]
		})
		qualities.forEach(function (quality) {
			quality.rangeParameters.forEach(function (parameter, index) {
				let paramMin = minMaxTracker[index][0]
				let paramMax = minMaxTracker[index][1]
				if (paramMin == null || parameter[1] < paramMin[1]) {
					paramMin = parameter
				}
				if (paramMax == null || parameter[1] > paramMax[1]) {
					paramMax = parameter
				}
				minMaxTracker[index][0] = paramMin
				minMaxTracker[index][1] = paramMax
			})
		})

		minMaxTracker.forEach(function (minMaxPair) {
			if ((minMaxPair[0] != minMaxPair[1]) && (minMaxPair[0] != null) && (minMaxPair[1] != null)) {
				text += minMaxPair[0][0] + " to " + minMaxPair[1][0] + ", "
			}
		})

		text += this.getQualityAndConstraintDescription(qualities)
		return text
	}

	// this helper class method is used to get the description of a range that contains MULTIPLE nodes
	// returns parameters that are the same across all qualities
	static getPartialDescription(qualities, numCharactersTotal) {
		var text = ""
		let base = qualities[0]
		var same = []
		text += this.getFrequencyModifier(qualities, numCharactersTotal)

		let includeParametersInDescription = false
		if (includeParametersInDescription) {
			// if a parameter is not included (i.e. null), do not include in description
			base.rangeParameters.forEach(function (parameter) {
				let val = (parameter == null) ? false : true
				same.push(val)
			})

			qualities.forEach(function (quality) {
				quality.rangeParameters.forEach(function (parameter, index) {
					if (parameter != null && (parameter[0] != base.rangeParameters[index][0])) {
						same[index] = false
					}
				})
			})

			same.forEach(function (isSame, index) {
				if (isSame) {
					text += base.rangeParameters[index][0] + " "
				}
			})
		}

		text += this.getQualityAndConstraintDescription(qualities)
		return text;
	}
}

class ColorQuality extends Quality {
	constructor(color, brightness, reflectance, saturation, pattern) {
		super(color, [pattern], [brightness, saturation], [reflectance])
		// color specific
		this.color = color
		this.brightness = brightness
		this.reflectance = reflectance
		this.saturation = saturation
		this.pattern = pattern
	}

	// overriden
	qualityConstraintsMatch(otherQuality) {
		return this.pattern == otherQuality.pattern
	}

	// overriden
	isSameQuality(otherQuality) {
		return this.color == otherQuality.color ? true : false
	}

	// overriden
	isNextInRange(otherQuality) {
		// returns true if color1 points to color2
		if (Colorsets[this.color] && Colorsets[this.color].has(otherQuality.color)) {
			return true
		}
		return false
	}
}

class Character {
	// this class does not safeguard against improper instantiations (i.e. assigning only a certainty constraint)
	constructor(negation, quality, preC, certaintyC, degreeC, postC) {
		// clause constraints for sorting
		this.negation = negation
		this.preC = preC
		this.postC = postC

		this.quality = quality
		// in range
		this.certaintyC = certaintyC
		this.degreeC = degreeC

		this.includedInGraph = false
	}
}

class Node {
	constructor(character) {
		this.name = character.quality.mainQuality //+ "+" + character.pattern
		// array contains characters that match in both color and pattern
		this.characters = []
		this.characters.push(character)
		this.after = []
		this.afterValid = []
		// used for topological sorting
		this.visited = false
		// used for graph tracking
		this.includedInGraph = false
	}
	
	setAfter(characterNode) {
		if (!this.after.includes(characterNode)) {
			this.after.push(characterNode)
			this.afterValid.push(false)
		}
	}
	
	addSameCharacter(characterNode){
		this.characters.push(characterNode)
	}

	getFullDescriptionForNode(getFullDescriptionForNode) {
		let qualities = []
		this.characters.forEach(function (character) {
			qualities.push(character.quality)
		})
		let text = this.characters[0].negation ? "" : "not "
		return text + (qualities[0].constructor).getFullDescription(qualities, getFullDescriptionForNode)
	}

	getPartialDescriptionForNode(numCharactersTotal) {
		let qualities = []
		this.characters.forEach(function (character) {
			qualities.push(character.quality)
		})
		let text = this.characters[0].negation ? "" : "not "
		return text + (qualities[0].constructor).getPartialDescription(qualities, numCharactersTotal)
	}
}

function runTest(characters) {
	// group by matching post and pre-constraint to determine comma-separated clauses
	let clauses = []
	characters.forEach(function (char) {
		var createNewClause = true
		clauses.forEach(function (clause) {
			// if this character fits into this clause, add to clause
			if ((clause[0].preC == char.preC) &&
				(clause[0].postC == char.postC) &&
				(clause[0].negation == char.negation) &&
				clause[0].quality.qualityConstraintsMatch(char.quality)) {
				clause.push(char)
				createNewClause = false
			}
		})
		// else create new clause
		if (createNewClause) {
			clauses.push([char])
		}
	})

	var fullDescription = ""

	clauses.forEach(function (clause, clauseIndex) {
		// form color graphs (directed, connected graphs)
		fullDescription += clause[0].preC ? clause[0].preC + " " : ""
		let graphs = []
		clause.forEach(function (character) {
			if (!character.includedInGraph) {
				character.includedInGraph = true
				var createNew = true
				
				graphs.every(function (graph) {
					graph.every(function (graphChar) {
						if(character.quality.isNextInRange(graphChar.quality)) {
							graph.push(character)
							createNew = false
							return
						}
					})
					if(!createNew) {
						return
					}
				})
				if (createNew) {
					var newgraph = createQualityGraph(character, clause, [character])
					graphs.push(newgraph)
				}
			}
		})
		graphs.forEach(function(graphCharacters, graphIndex) {
			// create quality nodes
			var nodes = []
			graphCharacters.forEach(function (character) {
				// if quality exists, add character to the node
				var createNewNode = true
				nodes.forEach(function (node) {
					if(node.characters[0].quality.isSameQuality(character.quality)) {
						node.addSameCharacter(character)
						createNewNode = false
					}
				})
				// if quality doesn't exist, create new node
				if (createNewNode) {
					let newNode = new Node(character)
					nodes.push(newNode)
				}
			}) 

			nodes.forEach(function (node) {
				// compare to other nodes
				nodes.forEach(function (otherNode) {
					if (node === otherNode) {
						return
					}
					if(node.characters[0].quality.isNextInRange(otherNode.characters[0].quality)) {
						node.setAfter(otherNode)
					}
				})
			})
			// order graphNodes topologically
			nodes = topologicalSort(nodes)
			// break up into ranges
			let newRanges = getRanges(nodes)
			// create descriptions from ranges
			fullDescription += (getDescriptionForRanges(newRanges, graphCharacters.length))

			if (graphIndex != (graphs.length - 1))
				fullDescription += ", or "
		})
		fullDescription += clause[0].postC ? " " + clause[0].postC : ""
		if (clauseIndex != (clauses.length -1)) {
			fullDescription += ", and "
		}
	})
	//console.log(fullDescription)
	return fullDescription
}

// nodes: a single directed, acyclic, topologically sorted graph
function getRanges(nodes) {
	let invalidNodes = []
	var arrayLength = nodes.length

	var counter = 0
	var currentNode = null

	var ranges = []
	var currentRange = []
	while (counter < nodes.length) {
		currentNode = nodes[counter]
		currentRange.push(currentNode)
		// check if there are more nodes after the current
		let nextNodeIndex = counter + 1

		if (nextNodeIndex < nodes.length) {
			let currentNodeNextNodeIndex = currentNode.after.indexOf(nodes[nextNodeIndex])
			if (currentNodeNextNodeIndex != -1) { // valid next node follows
				// bookkeeping
				currentNode.afterValid[currentNodeNextNodeIndex] = true
				if(!currentNode.afterValid.includes(false) && invalidNodes.includes(currentNode)) {
					// remove the node if it is valid now
					invalidNodes = invalidNodes.filter(function(e) { return e !== currentNode })
				} else {
					invalidNodes.push(currentNode)
				}
				counter ++
				continue
			}
		}
		// either at the end of the path, or a previous node is invalid
		if (invalidNodes.length > 0 && nextNodeIndex < nodes.length) {
			// some previous node must be invalid, it will exist as own range
			ranges.push([invalidNodes[0]])
			let invalidNodeInRangeIndex = currentRange.indexOf(invalidNodes[0])
			currentRange.splice(invalidNodeInRangeIndex, 1)
			if (currentRange.length) {
				ranges.push(currentRange)
			}
			// start from fresh
			currentRange = []
			counter = nodes.indexOf(invalidNodes[0]) + 2
			currentNode = nodes[counter - 1]
			// remove invalid node
			invalidNodes.splice(0, 1)
		} else {
			ranges.push(currentRange)
			counter ++
		}
	}
	return ranges
}

// creates one graph of quality nodes
function createQualityGraph(character, clause, newGraph) {
	// iterate through quality matches
	clause.forEach(function (clauseChar) {
		if(!clauseChar.includedInGraph) {
			if (character.quality.isNextInRange(clauseChar.quality)) {
				newGraph.push(clauseChar)
				clauseChar.includedInGraph = true
				createQualityGraph(clauseChar, clause, newGraph)
			}
		}
	})
	return newGraph
}

function topologicalSortUtil(node, stack) {
	node.visited = true
	if (node.after != null ){
		node.after.forEach(function (nextNode) {
			if (nextNode.visited == false){
				topologicalSortUtil(nextNode, stack)
			}
		})	
	}
	stack.push(node)
}

function topologicalSort(nodes) {
	let stack = []
	nodes.forEach(function (node) {
		if (node.visited == false) {
			topologicalSortUtil(node, stack)
		}
	})
	let reverseStack = stack.reverse()
	return reverseStack
}

// ranges: 2D array of nodes
// numCharacters: total number of characters, used to determine frequency modifier in description
function getDescriptionForRanges(ranges, numCharactersTotal) {
	var rangeDescription = ""
	ranges.forEach(function (range, index) {
		var aRangeDescription = ""
		if (range.length == 1) {
			aRangeDescription = range[0].getFullDescriptionForNode(numCharactersTotal)
		} else {
			range.forEach(function (node, nodeIndex) {
				aRangeDescription += node.getPartialDescriptionForNode(numCharactersTotal)
				if (nodeIndex != range.length - 1)
					aRangeDescription += " to "
			})
		}
		if (index != (ranges.length - 1))
			aRangeDescription += ", or "
		rangeDescription += aRangeDescription
	})
	return rangeDescription
}

// ------------------------- HELPER DEBUG FUNCTIONS -------------------------

function printNodeColors(message, nodes) {
	var ids = ""
	nodes.forEach(function (node) {
		ids += (node.characters[0].id + ", ")
	})
	console.log(message, ids)
}

function printNodeBeforeAfter(message, nodes) {
	var text = ""
	nodes.forEach(function (node) {
		text += (node.characters[0].id + ", ")
		text += "after: "
		node.after.forEach(function (after) {
			text += (after.characters[0].id + ", ")
		})
		text += "\n"
	})
	console.log(message, text)
}

// simple test data
let simpleGreen = new ColorQuality(Color.GREEN, null, null, null, null)
let simpleGreenCharacter = new Character(true, simpleGreen, null, null, null, null)

let simpleGreen2 = new ColorQuality(Color.GREEN, null, null, null, null)
let simpleGreenCharacter2 = new Character(true, simpleGreen2, null, null, null, null)

let simpleGreen3 = new ColorQuality(Color.GREEN, null, null, null, null)
let simpleGreenCharacter3 = new Character(true, simpleGreen3, null, null, null, null)

let simpleGold = new ColorQuality(Color.GOLD, null, null, null, null)
let simpleGoldCharacter = new Character(true, simpleGold, null, null, null, null)

let simpleBrown = new ColorQuality(Color.BROWN, null, null, null, null)
let simpleBrownCharacter = new Character(true, simpleBrown, null, null, null, null)

// more test data
let brownQuality = new ColorQuality(Color.BROWN, Brightness.MEDIUM, "eh", null, "speckled")
let brownCharacter = new Character(true, brownQuality, null, null, null, "abaxially")

let green1 = new ColorQuality(Color.GREEN, Brightness.BRIGHT, "dull", Saturation.GRAY, "speckled")
let greenCharacter1 = new Character(true, green1, "pre c", CertaintyConstraint.DOUBTFULLY, DegreeConstraint.CONSIDERABLY, "abaxially")

let green2 = new ColorQuality(Color.GREEN, Brightness.MEDIUM, "dull", Saturation.PALE, "solid")
let greenCharacter2 = new Character(true, green2, "pre c", CertaintyConstraint.DEFINITELY, DegreeConstraint.CONSIDERABLY, "abaxially")

let green3 = new ColorQuality(Color.GREEN, Brightness.DARK, "shiny", Saturation.PURE, "speckled")
let greenCharacter3 = new Character(true, green3, "pre c", CertaintyConstraint.DEFINITELY, DegreeConstraint.CONSIDERABLY, "abaxially")

let green4 = new ColorQuality(Color.GREEN, Brightness.DARK, "shiny", Saturation.PURE, "speckled")
let greenCharacter4 = new Character(true, green4, "pre c", CertaintyConstraint.DEFINITELY, DegreeConstraint.CONSIDERABLY, "different post c")

let brown1 = new ColorQuality(Color.BROWN, Brightness.BRIGHT, "dull", null, "speckled")
let brownCharacter1 = new Character(true, brown1, "pre c", null, DegreeConstraint.CONSIDERABLY, "abaxially")

let gold = new ColorQuality(Color.GOLD, Brightness.BRIGHT, "dull", null, "speckled")
let goldCharacter = new Character(true, gold, "pre c", null, DegreeConstraint.EXTREMELY, "abaxially")

let purple = new ColorQuality(Color.PURPLE, Brightness.BRIGHT, "dull", null, "speckled")
let purpleCharacter = new Character(true, purple, "pre c", null, DegreeConstraint.EXTREMELY, "abaxially")

let white = new ColorQuality(Color.WHITE, Brightness.BRIGHT, "dull", null, "speckled")
let whiteCharacter = new Character(true, white, "pre c", null, DegreeConstraint.EXTREMELY, "abaxially")

let yellow = new ColorQuality(Color.YELLOW, Brightness.BRIGHT, "dull", null, "speckled")
let yellowCharacter = new Character(true, yellow, "pre c", null, DegreeConstraint.EXTREMELY, "abaxially")

let red = new ColorQuality(Color.RED, Brightness.BRIGHT, "dull", null, "speckled")
let redCharacter = new Character(true, red, "pre c", null, DegreeConstraint.EXTREMELY, "abaxially")

let multipleRanges = [greenCharacter2, whiteCharacter, greenCharacter4, purpleCharacter]
let differentPatterns = [greenCharacter4, greenCharacter2, greenCharacter3] // one color, different patterns
let samePattern = [greenCharacter1, greenCharacter3] // one color, same patterns
let testRanges = [yellowCharacter, greenCharacter1, purpleCharacter] // 2 separate ranges in same clause
let testCase = [greenCharacter3, brownCharacter, whiteCharacter, greenCharacter2, greenCharacter4]

console.log(runTest(testRanges))
// runTest(testRanges)
