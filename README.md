# Dumpling Hunter Simlator
## By Kevin Bozarth and Sam Gallo


# GENERAL

This game is about a guy named Ben (yes, TA Ben) who travels across the land looking for ingredients to make his favorite food, dumplings. There are enemies looking to steal from him or eat him alive. There are also pigs who want to escape being turned into meat filling. When the player has all the ingredients, they can return to the kitchen and cook their dumplings.

Attack:
- Player can press J to slash that SOMETIMES kills enemies. Aim isn't always perfect in real life.

Death:
- Getting touched by an enemy NPC or their attack

Lose states
- Losing all 3 lives

Win state:
- Collect all 5 ingredients scattered across the map
- Press C while inside the kitchen

Controls:
- Movement: WASD
- Attack: J
- Cook: C
- Return to main menu: R

# NPC AND UNIQUE AI

## Kevin's AI

Thief enemy: Smart and sneaky. They will hide behind trees and wait for the player to get close enough before leaping out with a burst of speed and chasing down the player. If the player gets too far, it smartly returns to it's hiding spot behind the tree.

Evil Pig enemy: Not very smart or fast, but it can smell the player and know their location at all times. It travels from its home cobweb in a straight line towards the player until it is killed.

Pig: This NPC just wants to survive. It will run away from the player if the player gets too close. If it is chased into the edge of the map, it will disappear into the bushes and emerge elsewhere on the map.

## Sam's AI

Gnome enemy: These enemies will get scared and start scattering about when the player gets close to them. Once the player collects their treasured inngredient, however, they will chase the player down in anger. If the player gets too far away from the gnomes while they are scattering, they will stop and return home. Same thing happens if they are chasing the player and they get too far.

Crab enemy: These enemies will jump out of the pond once the player collects some of their home. These crabs have magic, and can teleport around the player at random intervals, making it to wehre if the player decides to run away from the crabs, they can appear on the other side of the player.

Frog enemy: These enemies will chase the player, and at a specific interval, will stop and shoot acid spit at the player. If the player gets too far away from the frogs, they will return to their poison swamp.

# LEVEL KEVIN

This map has a layout that gives the thief enemies a nice environment to use to their advantage against the player. The trees and giant mushrooms can be used by the thieves as cover to ambush the player when they're least expecting it.

This level features thieves, pigs, and evil pigs.

# LEVEL SAM

This map has different biomes around the map, and each biome houses a different enemy type. To the bottom left, we have the gnome forest, where the forest gnomes live with their flour. To the middle right, we have the pond, which houses the crab enemies that jump the player if they take from their home. To the top right, we have the poison swamp with the frogs that protect their main food source, green onions. The maze in the middle was created to corner the player off if they tried to grab ingredients with enemies chasing them. The top left is the mud pools, which have the pig NPC from Kevin's level as an easter egg.

# Rubric and Self Evaluation

## Slight change to rubric

We changed the enemy AI portion of the rubric. It is now worth three points instead of four, and these three points are the individual points of the self evaluation. We also added an extra category that has to do with the player and obstacle collisions worth one point. We will include our Design Document with the updated rubric in the zip of our project. It is a PDF, so it would need to be viewed outside of VS code or whatever you're using. The reason we opted to change the point count is because the AI used in our levels are made completely seperate from each other. The reason we added the extra point category is so that the total points for the rubric is still 10, as well as including a mechanic that is used throughout both levels.

## Self Evaluation

### First Category

Player Movement, 2 points: The player can move around the world, but their movement can be stopped when colliding with obstacle object layers and enemies.

The player in both of our levels can move around using the WASD keys. Their movement is stopped when colliding with obstacles, however, it does not stop when colliding with most enemies. Enemies that attack by touching reset the player's position, so that technically counts as being stopped when colliding. However, other enemies, mainly in Sam's level, have their own attack, so if they reach the player the sort of clip into the player rather then stopping on them. But their attack can hit the player when they are clipping into them, which resets the player's position, so it kind of works. 

1.8 points out of 2

### Second Category

Use of Intelligent AI, 3 points (individual): The enemies are able to chase the player and attack when close, and when certain conditions are met they can scatter and are able to attack from a distance.

If anything, we underscoped in this category. Originally we were going to have one enemy type that would be in both levels, and would attack the player up close as well as from far away. However, we realized that having one enemy type acting the same, as well as being in both levels, would make the game vvery repetitive. We decided to make multiple enemy types that have different ways of moving and attacking, and both levels having different enemy types progammed seperately by us for our own levels. They follow a similar outline to our orignal idea where they move and act differently depending on different conditions being met. 

3 points out of 3 for each of us

### Third Category

Cooking, 2 points: Once all the ingredients are gathered, the player is able to cook them in the kitchen to end the game.

This was very easy to program from the rubric. Each of us approached how the internals of the game works with collecting the ingredients, but mechanically they work the exact same. The player is able to collect the ingredients and cook in the kitchen by pressing C.

2 points out of 2 points

### Fourth Category

Attack, 2 points: The dumpling bandits take damage from the player’s attack, and only from the hitbox of it. The bandits also take some knockback after a hit.

The player is able to press J to slash at the enemies of the game, and when they are hit by the slash they die. We weren't able to implement the knockback as our slash hits the enemies multiple times during a slash, and we'd have to essentially rework how the slash works entirely to implement it and there's simply not enough time. To make up for it, we made the enemies challenging to kill, as well as have a lot of them, so we say it makes up for it somewhat.

1.8 points out of 2

### Fifth Category

Collisions, 1 point: The player and enemies are unable to move through obstacles.

For the most part, out collisions work with the obstacles. However, there's a weird bug in Sam's level where the Frog's just ignore this logic despite being added to the enemy array, and the collision being applied to every single enemy in the array. It is not a problem with the placement of the collision addition in the code, as the Crab enemy is created after the game is already running. Sam cannot figure out why this bug is occuring, but the colission works on every single other enemy.

1 point out of 1