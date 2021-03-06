import {Component, OnInit, ChangeDetectionStrategy} from "@angular/core";
import {State} from "../../reducers";
import {Store} from "@ngrx/store";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {HeroStatFactory} from "../../hero/hero-stat.factory";
import {TagStatFactory} from "../../hero/tag-stat.factory";
import {CurrentStats, StatsType, Stats} from "@grenn/contract";
import {Observable} from "rxjs/Observable";
import {getStats} from "../state/player.reducer";

@Component({
  selector: "app-player-hero-detail",
  templateUrl: "./player-hero-detail.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerHeroDetailComponent implements OnInit {

  public stats$: Observable<CurrentStats>;
  public hero$: Observable<string>;
  public playerId$: Observable<string>;

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
    private heroStat: HeroStatFactory,
    private tagStat: TagStatFactory
  ) {}

  public ngOnInit() {
    this.playerId$ = this.route.parent.paramMap
      .map((params: ParamMap) => {
        return params.get("playerId");
      });

    this.hero$ = this.route.paramMap
      .map((params: ParamMap) => {
        return params.get("hero");
      });

    this.stats$ = this.playerId$
      .switchMap(playerId => {
        return this.store.select(getStats(playerId))
          .filter(data => Boolean(data));
      });
  }

  public getAverageStats(stats: StatsType): Stats {
    return stats.avg || stats.total;
  }

  public getBestStats(stats: StatsType): Stats {
    return stats.best || stats.total;
  }
}
