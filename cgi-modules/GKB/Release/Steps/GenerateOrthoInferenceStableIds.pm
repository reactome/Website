package GKB::Release::Steps::GenerateOrthoInferenceStableIds;

use GKB::Release::Config;
use GKB::Release::Utils;

use GKB::NewStableIdentifiers;

use Moose;
extends qw/GKB::Release::Step/;

has '+gkb' => ( default => "gkbdev" );
has '+passwords' => ( default => sub { ['mysql'] } );
has '+directory' => ( default => "$release/generate_stable_ids_orthoinference" );
has '+mail' => ( default => sub {
                    my $self = shift;
                    return {
                        'to' => 'curation',
                        'subject' => $self->name,
                        'body' => "",
                        'attachment' => ""
                    };
});

override 'run_commands' => sub {
    my ($self, $gkbdir) = @_;
    
    $self->cmd("Backing up $db and $stable_id_db databases",
        [
            ["mysqldump --opt -u$user -p$pass $db > $db.beforeOrthoStableIDs.dump"],
            ["mysqldump --opt -u$user -p$pass $stable_id_db > $stable_id_db\_$version.beforeOrthoStableIDs.dump"]
        ]
    );
    
    $self->cmd("Generating stable ids for orthoinferences",
        [
            ["perl add_ortho_stable_ids.pl -user $user -pass $pass -db $db -sdb $slicedb -release_num $version " .
             " > generate_stable_ids_$version.ortho.out 2> generate_stable_ids_$version.ortho.err"]
        ]
    );
    
    $self->cmd("Saving stable ids to history database",
        [
            ["perl save_stable_id_history.pl -db $db -sdb $stable_id_db -user $user -pass $pass -release $version " .
            " > save_stable_id_history_$version.out 2> save_stable_id_history_$version.err"]
        ]
    );

    $self->cmd("Mapping old ST_IDs back to current set",
        [
            ["perl old_stable_id_mapping.pl -db $db > old_stable_id_mapping_$version.out 2> old_stable_id_mapping_$version.err"]
        ]
    );

    $self->cmd("Backing up $db and stable_identifiers databases",
        [
            ["mysqldump --opt -u$user -p$pass $db > $db.afterOrthoStableIDs.dump"],
            ["mysqldump --opt -u$user -p$pass $stable_id_db > $stable_id_db\_$version.afterOrthoStableIDs.dump"]
        ]
    );
};

# Collect and return problems with pre-requisites of stable identifiers
override 'pre_step_tests' => sub {
    my $self = shift;

    return get_stable_id_QA_problems_as_list_of_strings(get_dba($db));
};

override 'post_step_tests' => sub {
    my ($self) = shift;
    
    return grep { defined } (
        super(),
        $self->pre_step_tests(),
        get_stable_id_QA_problems_as_list_of_strings(get_dba($db)),
        _check_stable_id_count($db, "test_reactome_$prevver")
    );
};

sub _check_stable_id_count {
    my $current_db = shift;
    my $previous_db = shift;

    my $current_stable_id_count = get_dba($current_db)->class_instance_count("StableIdentifier");
    my $previous_stable_id_count = get_dba($previous_db)->class_instance_count("StableIdentifier");
    
    my $stable_id_count_change = $current_stable_id_count - $previous_stable_id_count;
    return "Stable id count has gone down from $current_stable_id_count for version $version " .
        " from $previous_stable_id_count for version $prevver" if $stable_id_count_change < 0;
}
