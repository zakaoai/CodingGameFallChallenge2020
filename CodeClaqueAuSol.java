import java.util.*;
import java.io.*;
import java.math.*;

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
class Player {

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);

        Commande commande;
        List<Commande> listCommande = new ArrayList<>();

        Inventaire inventaire;
        List<Inventaire> listInventaire = new ArrayList<>();

        int z=0;

        // game loop
        while (true) {
            int actionCount = in.nextInt(); // the number of spells and recipes in play
            for (int i = 0; i < actionCount; i++) {
                int actionId = in.nextInt(); // the unique ID of this spell or recipe
                String actionType = in.next(); // in the first league: BREW; later: CAST, OPPONENT_CAST, LEARN, BREW
                int delta0 = in.nextInt(); // tier-0 ingredient change
                int delta1 = in.nextInt(); // tier-1 ingredient change
                int delta2 = in.nextInt(); // tier-2 ingredient change
                int delta3 = in.nextInt(); // tier-3 ingredient change
                int price = in.nextInt(); // the price in rupees if this is a potion
                int tomeIndex = in.nextInt(); // in the first two leagues: always 0; later: the index in the tome if this is a tome spell, equal to the read-ahead tax
                int taxCount = in.nextInt(); // in the first two leagues: always 0; later: the amount of taxed tier-0 ingredients you gain from learning this spell
                boolean castable = in.nextInt() != 0; // in the first league: always 0; later: 1 if this is a castable player spell
                boolean repeatable = in.nextInt() != 0; // for the first two leagues: always 0; later: 1 if this is a repeatable player spell
                commande = new Commande(actionId, actionType,delta0, delta1, delta2, delta3, price, tomeIndex, taxCount, castable, repeatable);
                listCommande.add(commande);
            }
            for (int i = 0; i < 2; i++) {
                int inv0 = in.nextInt(); // tier-0 ingredients in inventory
                int inv1 = in.nextInt();
                int inv2 = in.nextInt();
                int inv3 = in.nextInt();
                int score = in.nextInt(); // amount of rupees
                System.err.println("i = " + i);
                System.err.println("inv0 " + inv0);
                System.err.println("inv1 " + inv1);
                System.err.println("inv2 " + inv2);
                System.err.println("inv3 " + inv3);
                System.err.println("score" + score);
                inventaire = new Inventaire(inv0, inv1, inv2, inv3, score);
                listInventaire.add(inventaire);
            }

            Collections.sort(listCommande, Commande.StuRollno);

            // Write an action using System.out.println()
            // To debug: System.err.println("Debug messages...");

            int idtest = listCommande.get(z).getActionId();


            // in the first league: BREW <id> | WAIT; later: BREW <id> | CAST <id> [<times>] | LEARN <id> | REST | WAIT
            System.out.println("BREW " + idtest);

            z++;
        }
    }
}

class Commande {

    int actionId;
    String actionType;
    int delta0;
    int delta1;
    int delta2;
    int delta3;
    int price;
    int tomeIndex;
    int taxCount;
    boolean castable;
    boolean repeatable;

    public int getActionId(){
        return actionId;
    }

    public int getPrice(){
        return price;
    }



    Commande(int actionId, String actionType, int delta0, int delta1, int delta2, int delta3, int price, int tomeIndex, int taxCount, boolean castable, boolean repeatable) {
        this.actionId = actionId;
        this.actionType = actionType;
        this.delta0 = delta0;
        this.delta1 = delta1;
        this.delta2 = delta2;
        this.delta3 = delta3;
        this.price = price;
        this.tomeIndex = tomeIndex;
        this.taxCount = taxCount;
        this.castable = castable;
        this.repeatable = repeatable;
    }

    public static Comparator<Commande> StuRollno = new Comparator<Commande>() {

	public int compare(Commande c1, Commande c2) {

	   int rollno1 = c1.getPrice();
	   int rollno2 = c2.getPrice();

	   return rollno2-rollno1;
   }};

}

class Inventaire  {
    int item0;
    int item1;
    int item2;
    int item3;
    int score;

    Inventaire(int item0, int item1, int item2, int item3, int score){
        this.item0 = item0;
        this.item1 = item1;
        this.item2 = item2;
        this.item3 = item3;
        this.score = score;
    }
}